const request = require('supertest')
const app = require('../app')
const { UserHospital, User, Hospital } = require('../models')

let user_data = {
    phone: '+62811371104',
    nik: 123456,
    name: 'Kiko',
    email: 'kiko@yahoo.com',
    status: 'Negative',
    isEmailVerify: true
}

let userId = 0
let hospitalId = 0

beforeAll(async function(done) {
    try {
        let user = await User.create(user_data)
        userId = user.id
        let hospital = await Hospital.create({
            name: 'RS Mitra Kerja',
            email: 'rsmitrakerja.admin@yahoo.com',
            address: 'Bogor, Jawa Barat',
            password: '12345678'
        })
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
    test('Should get object with keys: name, email, address', (done) => {
        request(app)
            .get(`/history/hospitals/${userId}`)
            .end(function(err, res) {
                if(err) throw err
                expect(res.status).toBe(200)
                expect(res.body.history[0]).toHaveProperty('hospitalId', expect.any(Number))
                done()
            })
    })
})

// describe('Get specific restaurant by its ID / ERROR CASE', () => {
//     test('Failed because restaurant is not found (incorrect restaurantId)', (done) => {
//         const false_restaurantId = 0
//         request(app)
//             .get(`/restaurants/${false_restaurantId}`)
//             .end(function(err, res) {
//                 const errors = ['Data Not Found']
//                 if(err) throw err
//                 expect(res.status).toBe(404)
//                 expect(res.body).toHaveProperty('errors', expect.any(Array))
//                 expect(res.body.errors).toEqual(expect.arrayContaining(errors))
//                 done()
//             })
//     })
// })
