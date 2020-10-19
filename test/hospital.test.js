const request = require('supertest')
const app = require('../app')
const { UserHospital, User, Hospital } = require('../models')
const { hashData } = require('../helpers/bcrypt')

let user_data = {
    phone: '+62811371104',
    nik: 123456,
    name: 'Kiko',
    email: 'kiko@yahoo.com',
    status: 'Negative',
    isEmailVerify: true
}

let hospitalAdmin_data = {
    name: 'RS Mitra Kerja',
    email: 'rsmitrakerja.admin@yahoo.com',
    address: 'Bogor, Jawa Barat',
    password: hashData('12345678')
}

let userId = 0
let hospitalId = 0

beforeAll(async function(done) {
    try {
        let user = await User.create(user_data)
        userId = user.id
        let hospital = await Hospital.create(hospitalAdmin_data)
        hospitalId = hospital.id
        await UserHospital.create({
            userId,
            hospitalId,
            testingType: 'Swab',
            isWaitingResult: false
        })
        done()
    } catch (err) {
        done(err)
    }
})

afterAll(async function(done) {
    try {
        await User.destroy({ truncate:true })
        await UserHospital.destroy({ truncate:true })
        await Hospital.destroy({ truncate:true })
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

const userHospital_data = {
    userId: 300,
    hospitalId: 100,
    testingType: 'Swab',
    isWaitingResult: true
}

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

describe('Hospital Admin Login / Success Case', () => {
    test('Should send object with keys: token, hospitalId and message', (done) => {
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



