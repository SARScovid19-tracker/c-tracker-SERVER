const request = require('supertest')
const app = require('../app')
const { UserRestaurant } = require('../models/')

const dummy_data = {
    userId: 500,
    restaurantId: 500
}

// afterAll((done) => {
//     UserRestaurant.destory({
//         where: {
//             userId: dummy_data.userId,
//             restaurantId: dummy_data.restaurantId
//         }
//     })
//     .then(_ => {
//         done()
//     })
//     .catch(err => done(err))
// })

describe('Save History Restaurant / Success Case', () => {
    test('should send and object with key message and addUserRestaurant', (done) => {
        request(app)
        .post('/history/restaurants')
        .send(dummy_data)
        .end((err, res) => {
            if(err) throw err
            expect(res.status).toBe(201)
            // expect(res.body.addUserRestaurant).toHaveProperty('message', 'Add Restaurant History Success')
            // expect(res.body.addUserRestaurant).toHaveProperty('userId', dummy_data.userId),
            // expect(res.body.addUserRestaurant).toHaveProperty('restaurantId', dummy_data.restaurantId)
            // expect(res.body.addUserRestaurant).toHaveProperty('createdAt', expect.any(String))
            // expect(res.body.addUserRestaurant).toHaveProperty('updatedAt', expect.any(String))
            done()
        })
    })
})

describe('Get History Restaurant / Success Case', () => {
    test('should send object with key history ', (done) => {
        request(app)
        .get('/history/restaurants/89')
        .end((err, res) => {
            if(err) throw err
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('history', expect.any(Array))
            done()
        })
    })
    
})