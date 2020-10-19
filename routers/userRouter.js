const router = require('express').Router()
const UserControllers = require('../controllers/UserControllers')

router.post('/register', UserControllers.register)
router.patch('/login', UserControllers.login)
router.post('/verify', UserControllers.verify)
router.get(`/authentication/activate`, UserControllers.activateAccount)
router.patch('/logout', UserControllers.logout)

module.exports = router