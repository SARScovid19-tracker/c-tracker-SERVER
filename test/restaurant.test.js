const request = require('supertest')
const app = require('../app')
const { Restaurant } = require('../models')

let restaurant_data = {
    name: 'The Coffee Bean Ciputra World',
    email: 'coffee-bean.management@yahoo.com',
    address: 'Ciputra World Mall, Surabaya, Jawa Timur'
}

let restaurantId = 0

beforeAll(async function(done) {
    try {
        let restaurant = await Restaurant.create(restaurant_data)
        restaurantId = restaurant.id
        done()
    } catch (err) {
        done(err)
    }
})

afterAll(async function(done) {
    try {
        await Restaurant.destroy(({
            where: {
                id: restaurantId
            } 
        }))
        done()
    } catch (err) {
        done(err)
    }
})

describe('Get specific restaurant by its ID / SUCCESS CASE', () => {
    test('Should get object with keys: name, email, address', (done) => {
        request(app)
            .get(`/restaurants/${restaurantId}`)
            .end(function(err, res) {
                if(err) throw err
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('name', restaurant_data.name)
                expect(res.body).toHaveProperty('email', restaurant_data.email)
                expect(res.body).toHaveProperty('address', restaurant_data.address)
                done()
            })
    })
})

describe('Get specific restaurant by its ID / ERROR CASE', () => {
    test('Failed because restaurant is not found (incorrect restaurantId)', (done) => {
        const false_restaurantId = 0
        request(app)
            .get(`/restaurants/${false_restaurantId}`)
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

describe('Get specific restaurant by its ID for QR / SUCCESS CASE', () => {
    test('Should get object with keys: restaurant_QR', (done) => {
        request(app)
            .get(`/qr/restaurants/${restaurantId}`)
            .end(function(err, res) {
                if(err) throw err
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('restaurant_QR', expect.any(String))
                done()
            })
    })
})

describe('Get specific restaurant by its ID for QR / ERROR CASE', () => {
    test('Failed because restaurant is not found (incorrect restaurantId)', (done) => {
        const false_restaurantId = 0
        request(app)
            .get(`/qr/restaurants/${false_restaurantId}`)
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
