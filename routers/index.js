const router = require('express').Router()
const userRouter = require('./userRouter')
const hospitalRouter = require('./hospitalRouter')
const restaurantRouter = require('./restaurantRouter')

router.use('/', userRouter)
router.use('/hospitals', hospitalRouter)
router.use('/restaurants', restaurantRouter)

module.exports = router