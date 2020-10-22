const request = require('supertest')
const app = require('../app')
const { UserHospital, User, Hospital, Restaurant, UserRestaurant } = require('../models')
const { hashData } = require('../helpers/bcrypt')

let userId = 0
let user1_id = 0
let user2_id = 0

let restaurantId = 0
let restaurantHistoryId1 = 0
let restaurantHistoryId2 = 0
let restaurantHistoryId3 = 0

let hospitalId = 0
let userHospitalId = 0
let historyId = 0

let user_data = {
    phone: '+62811111111',
    nik: 123456,
    name: 'Kiko',
    email: 'kiko@yahoo.com',
    status: 'Negative',
    isEmailVerify: true
}

let userFriend1_data = {
    phone: '+62822222222',
    nik: 123456,
    name: 'Ahmad',
    email: 'Ahmad@yahoo.com',
    status: 'Negative',
    isEmailVerify: true
}

let userFriend2_data = {
    phone: '+62833333333',
    nik: 123456,
    name: 'Akbar',
    email: 'akbar@yahoo.com',
    status: 'Negative',
    isEmailVerify: true
}

let hospitalAdmin_data = {
    name: '[DUMMY] RS Mitra Kerja',
    email: 'rsmitrakerja.admin@yahoo.com',
    address: 'Bogor, Jawa Barat',
    password: hashData('12345678')
}

let userHospital_data = {
    userId,
    hospitalId,
    testingType: '[DUMMY]Swab',
    isWaitingResult: true
}

let restaurant_data = {
    name: '[DUMMY] The Coffee Bean Ciputra World',
    email: 'coffee-bean.management@yahoo.com',
    address: 'Ciputra World Mall, Surabaya, Jawa Timur'
}

beforeAll(async function(done) {
    try {
        let user = await User.create(user_data)
        userId = user.id
        let user1 = await User.create(userFriend1_data)
        user1_id = user1.id
        let user2 = await User.create(userFriend2_data)
        user2_id = user2.id

        let restaurant = await Restaurant.create(restaurant_data)
        restaurantId = restaurant.id
        let userRestaurant = await UserRestaurant.bulkCreate([
            { restaurantId, userId },
            { restaurantId, userId: user1_id },
            { restaurantId, userId: user2_id }
        ], { returning: ['id']})
        restaurantHistoryId1 = userRestaurant[0].dataValues.id
        restaurantHistoryId2 = userRestaurant[1].dataValues.id
        restaurantHistoryId3 = userRestaurant[2].dataValues.id

        let hospital = await Hospital.create(hospitalAdmin_data)
        hospitalId = hospital.id
        let userHospital = await UserHospital.create({
            userId,
            hospitalId,
            testingType: '[DUMMY]Swab',
            isWaitingResult: true
        }, { returning: ['id']})
        historyId = userHospital.id
        userHospital_data.userId = userId
        userHospital_data.hospitalId = hospitalId
        userHospital_data.testingType = userHospital.testingType
        userHospital_data.isWaitingResult = userHospital.isWaitingResult
        // console.log(userHospital, '<<<<< userHospital itself');
        // console.log(userHospital.id, '<<<<<<< historyId');
        // console.log(userHospital_data.userId, '<<<<<<< userId');
        // console.log(userHospital_data.hospitalId, '<<<<<<< hospitalId');
        done()
    } catch (err) {
        done(err)
    }
})

afterAll(async function(done) {
    try {
        await User.destroy({ where: { phone: '+62811111111' }})
        await User.destroy({ where: { phone: '+62822222222' }})
        await User.destroy({ where: { phone: '+62833333333' }})
        await UserHospital.destroy({ where: { testingType: '[DUMMY]Swab'}})
        await Hospital.destroy({ where: { name: '[DUMMY] RS Mitra Kerja' }})
        await Restaurant.destroy({ where: { name: '[DUMMY] The Coffee Bean Ciputra World' }})
        await UserRestaurant.destroy({ where: { id: restaurantHistoryId1 }})
        await UserRestaurant.destroy({ where: { id: restaurantHistoryId2 }})
        await UserRestaurant.destroy({ where: { id: restaurantHistoryId3 }})
        done()
    } catch (err) {
        done(err)
    }
})

describe('Get lists of attended hospital for COVID-19 testing by specific user / SUCCESS CASE', () => {
    test('Should get object with at least following keys: hospitalId, userId, id, isWaitingResult', (done) => {
        request(app)
            .get(`/history/hospitals/${userId}`)
            .end(function(err, res) {
                if(err) throw err
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('history', expect.any(Array))
                expect(res.body.history[0]).toHaveProperty('hospitalId', expect.any(Number))
                expect(res.body.history[0]).toHaveProperty('userId', expect.any(Number))
                expect(res.body.history[0]).toHaveProperty('id', expect.any(Number))
                expect(res.body.history[0]).toHaveProperty('isWaitingResult', expect.any(Boolean))
                done()
            })
    })
})

describe('Get lists of attended hospital for COVID-19 testing by specific user / ERROR CASE', () => {
    test('Failed because user is not found (incorrect ID)', (done) => {
        const false_userId = ['false']
        request(app)
            .get(`/history/hospitals/${false_userId}`)
            .end(function(err, res) {
                const errors = ['Internal Server Error']
                if(err) throw err
                expect(res.status).toBe(500)
                expect(res.body).toHaveProperty('errors', expect.any(Array))
                expect(res.body.errors).toEqual(expect.arrayContaining(errors))
                done()
            })
    })
})

describe('Save testing and hospital attendance history / SUCCESS CASE', () => {
    test('should send and object with key message and addUserHospital', (done) => {
        request(app)
        .post('/history/hospitals')
        .send(userHospital_data)
        .end((err, res) => {
            if(err) throw err
            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('message', 'Add Hospital History Success')
            expect(res.body.addUserHospital).toHaveProperty('userId', userHospital_data.userId),
            expect(res.body.addUserHospital).toHaveProperty('hospitalId', userHospital_data.hospitalId)
            expect(res.body.addUserHospital).toHaveProperty('testingType', userHospital_data.testingType)
            expect(res.body.addUserHospital).toHaveProperty('isWaitingResult', userHospital_data.isWaitingResult)
            expect(res.body.addUserHospital).toHaveProperty('createdAt', expect.any(String))
            expect(res.body.addUserHospital).toHaveProperty('updatedAt', expect.any(String))
            done()
        })
    })
})

describe('Save testing and hospital attendance history / ERROR CASE', () => {
    test('failed because of hospitalId is filled with non-integer character', (done) => {
        request(app)
        .post('/history/hospitals')
        .send({ hospitalId: ['Supposed to be not this data']})
        .end(function(err, res) {
            const errors = ['Internal Server Error']
            if(err) throw err
            expect(res.status).toBe(500)
            expect(res.body).toHaveProperty('errors', expect.any(Array))
            expect(res.body.errors).toEqual(expect.arrayContaining(errors))
            done()
        })
    })
})

describe('Hospital Admin Login / Success Case', () => {
    test('Should send object with keys: email and password', (done) => {
        request(app)
            .post('/hospitals/login')
            .send({
                email: hospitalAdmin_data.email,
                password: '12345678'
            })
            .end(function(err, res) {
                if(err) throw err
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('message', 'Login Success')
                expect(res.body).toHaveProperty('token', expect.any(String))
                expect(res.body).toHaveProperty('hospitalId', expect.any(Number))
                expect(res.body).not.toHaveProperty('password')
                done()
            })
    })
})

describe('Hospital Admin Login / ERROR CASE', () => {
    test('Failed because email has not been registered', (done) => {
        const fake_email = 'zzz@zzz.com'
        request(app)
            .post('/hospitals/login')
            .send({
                email: fake_email,
                password: '12345678'
            })
            .end(function(err, res) {
                const errors = ['Invalid Email or Password']
                if(err) throw err
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('errors', expect.any(Array))
                expect(res.body.errors).toEqual(expect.arrayContaining(errors))
                done()
            })
    })
    test('Failed because of wrong password', (done) => {
        const wrongPassword = 'semuaLulusPakeTeachersAward'
        request(app)
            .post('/hospitals/login')
            .send({
                email: hospitalAdmin_data.email,
                password: wrongPassword
            })
            .end(function(err, res) {
                const errors = ['Invalid Email or Password']
                if(err) throw err
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('errors', expect.any(Array))
                expect(res.body.errors).toEqual(expect.arrayContaining(errors))
                done()
            })
    })
})

describe('Get hospital by its ID / SUCCESS CASE', () => {
    test('Should get object with at least following keys: name, email, id, address', (done) => {
        request(app)
            .get(`/hospitals/${hospitalId}`)
            .end(function(err, res) {
                if(err) throw err
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('name', hospitalAdmin_data.name)
                expect(res.body).toHaveProperty('name', expect.any(String))
                expect(res.body).toHaveProperty('id', expect.any(Number))
                expect(res.body).toHaveProperty('address', expect.any(String))
                expect(res.body).toHaveProperty('email', expect.any(String))
                done()
            })
    })
})

describe('Get hospital by its ID / ERROR CASE', () => {
    test('Failed because hospital is not found (incorrect ID)', (done) => {
        const false_hospitalId = 0
        request(app)
            .get(`/hospitals/${false_hospitalId}`)
            .end(function(err, res) {
                const errors = ['Data Not Found']
                if(err) throw err
                expect(res.status).toBe(404)
                expect(res.body).toHaveProperty('errors', expect.any(Array))
                expect(res.body.errors).toEqual(expect.arrayContaining(errors))
                done()
            })
    })
})

describe('Get specific hospital by its ID for QR / SUCCESS CASE', () => {
    test('Should get object with keys: hospital_QR', (done) => {
        request(app)
            .get(`/qr/hospitals/${hospitalId}`)
            .end(function(err, res) {
                if(err) throw err
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('hospital_QR', expect.any(String))
                done()
            })
    })
})

describe('Get specific hospital by its ID for QR / ERROR CASE', () => {
    test('Failed because hospital is not found (incorrect hospitalId)', (done) => {
        const false_hospitalId = 0
        request(app)
            .get(`/qr/hospitals/${false_hospitalId}`)
            .end(function(err, res) {
                const errors = ['Data Not Found']
                if(err) throw err
                expect(res.status).toBe(404)
                expect(res.body).toHaveProperty('errors', expect.any(Array))
                expect(res.body.errors).toEqual(expect.arrayContaining(errors))
                done()
            })
    })
})

describe('Get list of patients of specific hospital by its id / SUCCESS CASE', () => {
    test('Should get object with at least following keys: hospitalId, userId, id, testingType', (done) => {
        request(app)
            .get(`/hospitals/patient-list/${hospitalId}`)
            .end(function(err, res) {
                if(err) throw err
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('data', expect.any(Array))
                expect(res.body.data[0]).toHaveProperty('hospitalId', expect.any(Number))
                expect(res.body.data[0]).toHaveProperty('userId', expect.any(Number))
                expect(res.body.data[0]).toHaveProperty('id', expect.any(Number))
                expect(res.body.data[0]).toHaveProperty('testingType', expect.any(String))
                done()
            })
    })
})

describe('Get list of patients of specific hospital by its id / ERROR CASE', () => {
    test('Failed because hospital is not found (incorrect ID)', (done) => {
        const false_hospitalId = ['false']
        request(app)
            .get(`/hospitals/patient-list/${false_hospitalId}`)
            .end(function(err, res) {
                const errors = ['Internal Server Error']
                if(err) throw err
                expect(res.status).toBe(500)
                expect(res.body).toHaveProperty('errors', expect.any(Array))
                expect(res.body.errors).toEqual(expect.arrayContaining(errors))
                done()
            })
    })
})

describe('Update user history list of doing COVID-19 testing / SUCCESS CASE', () => {
    test('Update the testing result to NEGATIVE', (done) => {
        request(app)
            .put('/hospitals/update-status')
            .send({
                userId, status: "Negative", hospitalId, historyId
            })
            .end(function(err, res) {
                if(err) throw err
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('message', 'Update Success..')
                expect(res.body).toHaveProperty('message', expect.any(String))
                done()
            })
    })
    test('Update the testing result to POSITIVE', (done) => {
        request(app)
            .put('/hospitals/update-status')
            .send({
                userId, status: "Positive", hospitalId, historyId
            })
            .end(function(err, res) {
                if(err) throw err
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('message', 'Success Send Notification')
                expect(res.body).toHaveProperty('message', expect.any(String))
                expect(res.body).toHaveProperty('devId', expect.any(Array))
                done()
            })
    })
})

describe('Update user history list of doing COVID-19 testing / ERROR CASE', () => {
    test('Failed because front-end send the wrong body', (done) => {
        const false_body = { status: "Positive", hospitalId, historyId }
        request(app)
            .put('/hospitals/update-status')
            .send(false_body)
            .end(function(err, res) {
                const errors = ['Internal Server Error']
                if(err) throw err
                expect(res.status).toBe(500)
                expect(res.body).toHaveProperty('errors', expect.any(Array))
                expect(res.body.errors).toEqual(expect.arrayContaining(errors))
                done()
            })
    })
})



