const request = require('supertest')
const app = require('../app')
const { User } = require('../models/')
const {generateToken} = require('../helpers/jwt')
const axios = require('axios')
const sendPushNotification = require('../helpers/notification')

let user_data = {
    phone: '+6212345678910',
    nik: '123456',
    name: 'Testing',
    email: 'testing@mail.com'
}

const token = generateToken(user_data)

let phone = {
    phone: '+6289657501544',
    deviceId: 'ulalablabla12345'
}

let phone_verify = {
    phone: '+62811371104',
    code: 628217,
    deviceId: 'blublub1234'
}

afterAll((done) => {
    User.destroy({
        where: {
            phone: user_data.phone
        }
    })
    .then(_ => {
        done()
    })
    .catch(err => done(err))
})

afterEach(() => { 
    jest.clearAllMocks(); 
    jest.resetAllMocks();
});

jest.mock('axios')

test('should be able to send device token', () => {
    const response = { msg: "Expo push token works!" }
    axios.post.mockResolvedValue(response)
    return sendPushNotification('ExponentPushToken[noIv86Iv0kqMRacllB1h0q]')
        .then(({msg}) => expect(res.status).toBe(201))
})

describe('register / Success Case', () => {
    test('should send object with key message, name, and email', (done) => {
        request(app)
            .post('/register')
            .send(user_data)
            .end((err, res) => {
                if(err) throw err
                expect(res.status).toBe(201)
                expect(res.body).toHaveProperty('message', 'Register new user success, Please check your email to activate your account')
                expect(res.body).toHaveProperty('name', user_data.name)
                expect(res.body).toHaveProperty('email', user_data.email)
                done()
            })
    })
})

describe('register / Error Case', () => {
    test('error because phone number already registered', (done) => {
        request(app)
            .post('/register')
            .send(user_data)
            .end((err, res) => {
                const errors = ['Phone Number Already Registered!']
                if(err) throw err
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('errors', expect.any(Array))
                expect(res.body.errors).toEqual(expect.arrayContaining(errors))
                done()
            })
    })
    test('error because email already registered', (done) => {
        let email_already = {...user_data, phone: '1000222345'}
        request(app)
            .post('/register')
            .send(email_already)
            .end((err, res) => {
                const errors = ['Email Already Registered']
                if(err) throw err
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('errors', expect.any(Array))
                expect(res.body.errors).toEqual(expect.arrayContaining(errors))
                done()
            })

    })
    test('error because one of required field is empty', (done) => {
        const empty_nik = {...user_data, phone: '1000222345', email: 'testt@mail.com', nik: ''}
        request(app)
            .post('/register')
            .send(empty_nik)
            .end((err, res) => {
                const errors = ['NIK is Required']
                if(err) throw err
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('errors', expect.any(Array))
                expect(res.body.errors).toEqual(expect.arrayContaining(errors))
                done()
            })
    })
    test('error because NIK more than 6 digits', (done) => {
        const nik_more_than_6_digits = {...user_data, nik: '1234567890', phone: '0000222345', email: 'testtt@mail.com'}
        request(app)
            .post('/register')
            .send(nik_more_than_6_digits)
            .end((err, res) => {
                const errors = ['Must Input 6 Digits NIK']
                if(err) throw err
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('errors', expect.any(Array))
                expect(res.body.errors).toEqual(expect.arrayContaining(errors))
                done()
            })
    })
})

describe('Activate Account / Success Case', () => {
    test('should send "text Activation account successfully, you can close this page"', (done) => {
        request(app)
            .get('/authentication/activate')
            .query({token: token})
            .end((err, res) => {
                if(err) throw err
                expect(res.status).toBe(200)
                done()
            })
    })
})

describe('Logout Account / Success Case', () => {
    test('should send object with key message', (done) => {
        request(app)
            .patch('/logout')
            .send({phone: '+6212345678910'})
            .end((err, res) => {
                if(err) throw err
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('message', 'Logout Success')
                done()
            })
    })
})

describe('Logout Account / Error Case', () => {
    test('error internal server error', (done) => {
        request(app)
            .patch('/logout')
            .send('+6212345678910')
            .end((err, res) => {
                const errors = ['Internal Server Error']
                if(err) throw err
                expect(res.status).toBe(500)
                expect(res.body).toHaveProperty('errors', expect.any(Array))
                expect(res.body.errors).toEqual(expect.arrayContaining(errors))
                done()
            })
    })
})

describe('Login User / Success Case', () => {
    test('should send object with key message', (done) => {
        request(app)
            .patch('/login')
            .send(phone)
            .end((err, res) => {
                if(err) throw err
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('message', 'Send OTP success..')
                done()
            })
    })
})

describe('Verify User / Success Case', () => {
    test('should send object with key message', (done) => {
        request(app)
            .post('/verify')
            .send(phone_verify)
            .end((err, res) => {
                if(err) throw err
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('message', 'Thanks, Login Success!')
                expect(res.body).toHaveProperty('deviceId', phone_verify.deviceId)
                expect(res.body).toHaveProperty('token', expect.any(String))
                expect(res.body).toHaveProperty('isEmailVerify', true)
                done()
            })
    })
})

describe('Login User / Error Case', () => {
    test('error because phone number is wrong', (done) => {
        const errors = ['Invalid Phone Number']
        request(app)
            .patch('/login')
            .send({phone: '123456789'})
            .end((err, res) => {
                if(err) throw err
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('errors', expect.any(Array))
                expect(res.body.errors).toEqual(expect.arrayContaining(errors))
                done()
            })
    })
})

describe('Login User / Error Case', () => {
    test('error because email is not verify', (done) => {
        const errors = ['Please Verify Your Email First Before Login']
        request(app)
            .patch('/login')
            .send({phone: '+6289657501545'})
            .end((err, res) => {
                if(err) throw err
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('errors', expect.any(Array))
                expect(res.body.errors).toEqual(expect.arrayContaining(errors))
                done()
            })
    })
})

describe('Login User / Error Case', () => {
    test('error because email is not verify', (done) => {
        const errors = ['Please logout first on the previous device']
        request(app)
            .patch('/login')
            .send({phone: '62812345699'})
            .end((err, res) => {
                if(err) throw err
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('errors', expect.any(Array))
                expect(res.body.errors).toEqual(expect.arrayContaining(errors))
                done()
            })
    })
})