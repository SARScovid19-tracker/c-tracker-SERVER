const router = require('express').Router()
const UserController = require('../controllers/UserControllers')

router.post('/register', UserController.register)
router.get('/login', UserController.login)
router.get('/verify', UserController.verify)

module.exports = router