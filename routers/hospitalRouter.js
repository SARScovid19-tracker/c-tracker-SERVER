const router = require('express').Router()
const HospitalControllers = require('../controllers/HospitalControllers')
const UserHospitalControllers = require('../controllers/UserHospitalControllers')

router.post('/login', HospitalControllers.login)
router.get('/:id', HospitalControllers.getById)
router.get('/patient-list/:hospitalId', UserHospitalControllers.getByHospitalId)

module.exports = router