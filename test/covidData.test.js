const request = require('supertest')
const app = require('../app')

describe('Get data Succes', () => {
    test('should send object with key positif, dirawat, sembuh, meninggal, tanggal', (done) => {
        request(app)
            .get('/covid-update')
            .end((err, res) => {
                if(err) throw err
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('positif', expect.any(Number))
                expect(res.body).toHaveProperty('dirawat', expect.any(Number))
                expect(res.body).toHaveProperty('sembuh', expect.any(Number))
                expect(res.body).toHaveProperty('meninggal', expect.any(Number))
                expect(res.body).toHaveProperty('tanggal', expect.any(String))
                done()
            })
    })
    
})