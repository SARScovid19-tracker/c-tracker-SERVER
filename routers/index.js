const router = require('express').Router()
const userRouter = require('./userRouter')
const hospitalRouter = require('./hospitalRouter')
const restaurantRouter = require('./restaurantRouter')
const historyRouter = require('./historyRouter')

router.use('/', userRouter)
router.use('/hospitals', hospitalRouter)
router.use('/restaurants', restaurantRouter)
router.use('/history', historyRouter)

module.exports = router