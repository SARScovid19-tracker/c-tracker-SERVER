const {User} = require('../models/')
const config = require('../otp/config')
const client = require('twilio')(config.accountSID, config.authToken)
const {generateToken} = require('../helpers/jwt')

class UserControllers {
    static async register(req, res, next) {
        let {phone, nik, name, email} = req.body
        try {
            const user = await User.create({
                phone, nik, name, email, status: 'negative'
            })
            res.status(201).json({
                message: 'Register new user success',
                name: user.name,
                email: user.email
            })
        } catch(err) {
            next(err)
        }
    }
    static async login(req, res, next) {
        let {phone} = req.body
        try {
            const user = await User.findOne({where:{phone}})
            if(!user) {
                throw {name: 'LOGIN_FAILED'}
            } else {
                const sendOtp = await client
                    .verify
                    .services(config.serviceID)
                    .verifications
                    .create({
                        to: phone,
                        channel: 'sms'
                    })
                res.status(200).json({sendOtp})
            }
        } catch(err) {
            next(err)
        }
    }
    static async verify(req, res, next) {
        let {phone, code} = req.body
        try {
            const verifyOtp = await client
                .verify
                .services(config.serviceID)
                .verificationChecks
                .create({
                    to: phone,
                    code
                })
            if(!verifyOtp.valid) {
                throw {name: 'INVALID_OTP'}
            } else {
                let payload = {
                    phone
                }
                let token = generateToken(payload)
                res.status(200).json({
                    message: 'Thanks, Login Success!',
                    token
                })
            }
        } catch(err) {
            next(err)
        }
    }
}

module.exports = UserControllers