const router = require('express').Router()
const QrHospitalControllers = require('../controllers/QrHospitalControllers')
const QrRestaurantControllers = require('../controllers/QrRestaurantControllers')

router.get('/hospitals/:id', QrHospitalControllers.getById)
router.get('/restaurants/:id', QrRestaurantControllers.getById)

module.exports = router