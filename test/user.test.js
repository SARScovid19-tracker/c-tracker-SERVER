const request = require('supertest')
const app = require('../app')
const { User } = require('../models/')

let user_data = {
    phone: '+12345678810',
    nik: '123456',
    name: 'Testing',
    email: 'testing@mail.com',
    deviceId: 'ulalablabla12345'
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

describe('register / Success Case', () => {
    test('should send object with key message, name, and email', (done) => {
        request(app)
            .post('/register')
            .send(user_data)
            .end((err, res) => {
                if(err) throw err
                expect(res.status).toBe(201)
                expect(res.body).toHaveProperty('message', 'Register new user success')
                expect(res.body).toHaveProperty('name', user_data.name)
                expect(res.body).toHaveProperty('email', user_data.email)
                done()
            })
    })
})