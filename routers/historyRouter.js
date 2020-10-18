const router = require('express').Router()
const UserRestaurantControllers = require('../controllers/UserRestaurantControllers')
const UserHospitalControllers = require('../controllers/UserHospitalControllers')

router.get('/restaurants/:userId', UserRestaurantControllers.getByUserId)
router.post('/restaurants', UserRestaurantControllers.create)
router.get('/hospitals/:userId', UserHospitalControllers.getByUserId)
router.post('/hospitals', UserHospitalControllers.create)

module.exports = router