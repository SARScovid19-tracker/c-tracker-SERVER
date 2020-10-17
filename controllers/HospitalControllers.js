const {Hospital} = require('../models/')
const {compareHash} = require('../helpers/bcrypt')
const {generateToken} = require('../helpers/jwt')

class HospitalControllers {
    static async login(req, res, next) {
        const {email, password} = req.body
        try {
            const data = await Hospital.findOne({where: {email}})
            if(!data) {
                throw {name: 'LOGIN_FAILED'}
            } else {
                const comparePass = compareHash(password, data.password)
                if(!comparePass) {
                    throw {name: 'LOGIN_FAILED'}
                } else {
                    let payload = {
                        id: data.id,
                        email: data.email,
                        name: data.name
                    }
                    const token = generateToken(payload)
                    res.status(200).json({message: 'Login Success', token})
                }
            }
        } catch(err) {
            console.log(err)
            next(err)
        }
    }
}

module.exports = HospitalControllers