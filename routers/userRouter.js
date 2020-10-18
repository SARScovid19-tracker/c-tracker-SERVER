const router = require('express').Router()
const UserControllers = require('../controllers/UserControllers')

router.post('/register', UserControllers.register)
router.get('/login', UserControllers.login)
router.get('/verify', UserControllers.verify)
router.get(`/authentication/activate`, UserControllers.activateAccount)

module.exports = router