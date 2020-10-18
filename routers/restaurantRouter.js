const router = require('express').Router()
const RestaurantController = require('../controllers/RestaurantController')

router.get('/:id', RestaurantController.getById)

module.exports = router