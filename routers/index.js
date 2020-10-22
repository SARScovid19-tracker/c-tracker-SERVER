const router = require('express').Router()
const userRouter = require('./userRouter')
const hospitalRouter = require('./hospitalRouter')
const restaurantRouter = require('./restaurantRouter')
const historyRouter = require('./historyRouter')
const qrRouter = require('./qrRouter')
const CovidDataController = require('../controllers/CoviidDataController')

router.use('/', userRouter)
router.use('/hospitals', hospitalRouter)
router.use('/restaurants', restaurantRouter)
router.use('/history', historyRouter)
router.use('/qr', qrRouter)
router.get('/covid-update', CovidDataController.getData)

module.exports = router