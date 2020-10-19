const router = require('express').Router()
const HospitalControllers = require('../controllers/HospitalControllers')
const UserHospitalControllers = require('../controllers/UserHospitalControllers')

router.post('/login', HospitalControllers.login)
router.put('/update-status', HospitalControllers.updateStatus)
router.get('/:id', HospitalControllers.getById)
router.get('/patient-list/:hospitalId', UserHospitalControllers.getByHospitalId)

module.exports = router