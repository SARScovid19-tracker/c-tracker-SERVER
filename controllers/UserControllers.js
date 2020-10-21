const {User} = require('../models/')
const config = require('../otp/config')
const client = require('twilio')(config.accountSID, config.authToken)
const {generateToken, verifyToken} = require('../helpers/jwt')
const nodemailer = require('nodemailer')

class UserControllers {
    static async register(req, res, next) {
        let {phone, nik, name, email} = req.body
        const template = fs.readFileSync('../helpers/email-template.html')
        try {
            const uniqueValidationPhone = await User.findOne({where: {phone}})
            if(uniqueValidationPhone) {
                throw {name: 'PHONE_NOT_UNIQUE'}
            } else {
                const uniqueValidationMail = await User.findOne({where: {email}})
                if(uniqueValidationMail) {
                    throw {name: 'EMAIL_NOT_UNIQUE'}
                } else {
                    const user = await User.create({
                        phone, nik, name, email, status: 'Negative', isEmailVerify: false
                    })
                    const payload = {
                        phone, nik, name, email
                    }
                    const token = generateToken(payload)
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.SENDER_EMAIL,
                            pass: process.env.SENDER_PASSWORD
                        }
                    })
                    let data = {
                        token,
                        phone
                    }
                    let mailOptions = {
                        from: '"noreply"<library.jhon2@gmail.com>',
                        to: email,
                        subject: 'Account Activation Link',
                        html: 
                        `
                            <h2><b>Please click on given link to activate your account</b></h2>
                            <p>${process.env.URL}authentication/activate?token=${token}</p>
                        `
                    }
                    transporter.sendMail(mailOptions, (err, info) => {
                        if(err) {
                            console.log(err)
                        } else {
                            console.log(`Email sent to: ${email}` )
                            res.status(201).json({
                                message: 'Register new user success, Please check your email to activate your account',
                                name: user.name,
                                email: user.email
                            })
                        }
                    })
                }
            }
        } catch(err) {
            next(err)
        }
    }
    static async activateAccount(req, res, next) {
        const {token} = req.query
        const decode = verifyToken(token)
        const user = await User.update({
            isEmailVerify: true
        }, {
            where: {
                email: decode.email
            }
        })
        res.status(200).send('Activation account successfully, you can close this page')
    }
    static async login(req, res, next) {
        let {phone} = req.body
        try {
            const user = await User.findOne({where:{phone}})
            if(!user) {
                throw {name: 'LOGIN_FAILED'}
            } else if(!user.isEmailVerify) {
                throw {name: 'VERIFY_EMAIL_FIRST'}
            } else {
                if(user.deviceId) {
                    throw {name: 'LOGOUT_FIRST'}
                } else {
                    const sendOtp = await client
                        .verify
                        .services(config.serviceID)
                        .verifications
                        .create({
                            to: phone,
                            channel: 'sms'
                        })
                    res.status(200).json({message: 'Send OTP success..', sendOtp})
                }
            }
        } catch(err) {
            console.log(err)
            next(err)
        }
    }
    static async verify(req, res, next) {
        let {phone, code, deviceId} = req.body
        try {
            const user = await User.findOne({where: {phone}})
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
                const addDeviceId = await User.update({
                    deviceId
                }, {where: {phone}})
                let payload = {
                    id: user.id,
                    phone
                }
                let token = generateToken(payload)
                res.status(200).json({
                    message: 'Thanks, Login Success!',
                    token,
                    id: user.id,
                    phone,
                    nik: user.nik,
                    name: user.name,
                    deviceId: user.deviceId,
                    isEmailVerify: user.isEmailVerify,
                    status: user.status
                })
            }
        } catch(err) {
            next(err)
        }
    }
    static async logout(req, res, next) {
        let {phone} = req.body
        try {
            const removeDeviceId = await User.update({
                deviceId: null
            }, {
                where: {
                    phone
                }
            })
            res.status(200).json({message: 'Logout Success'})
        } catch(err) {
            console.log(err)
            next(err)
        }
    }
}

module.exports = UserControllers