const router = require('express').Router()
const userRouter = require('./userRouter')
const hospitalRouter = require('./hospitalRouter')

router.use('/', userRouter)
router.use('/hospitals', hospitalRouter)

module.exports = router