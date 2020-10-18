const router = require('express').Router()
const HospitalControllers = require('../controllers/HospitalControllers')

router.post('/login', HospitalControllers.login)
router.get('/:id', HospitalControllers.getById)

module.exports = router