const router = require('express').Router()
const HospitalControllers = require('../controllers/HospitalControllers')

router.post('/login', HospitalControllers.login)

module.exports = router