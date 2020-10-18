const {Hospital, User, UserRestaurant, UserHospital, Sequelize} = require('../models/')
const {compareHash} = require('../helpers/bcrypt')
const {generateToken} = require('../helpers/jwt')
const { Op } = require('sequelize/types')
const moment = require('moment')

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
                    res.status(200).json({message: 'Login Success', token, hospitalId: data.id})
                }
            }
        } catch(err) {
            console.log(err)
            next(err)
        }
    }

    static async getById(req, res, next) {
        const {id} = req.params
        try {
            const hospital = await Hospital.findOne({where: {id}})
            if(!hospital) {
                throw {name: 'DATA_NOT_FOUND'}
            } else {
                res.status(200).json({
                    id: hospital.id,
                    name: hospital.name,
                    email: hospital.email,
                    address: hospital.address
                })
            }
        } catch(err) {
            next(err)
        }
    }
    static async updateStatus(req, res, next) {
        const {userId, status, hospitalId, historyId} = req.body
        try {
            const updateUserStatus = await User.update({status}, {where: {id: userId}})
            const updateUserHospital = await UserHospital.update({
                isWaitingResult: false,
                publishedAt: new Date()
            }, {where: {userId, hospitalId, id: historyId}})
            if(status === 'negative') {
                res.status(200).json({message: 'Update Success..'})
            } else {
                const restaurantList = await UserRestaurant.findAll({
                    where: {
                        userId,
                        createdAt: {
                            [Op.gte]: moment().subtract(7, 'days').toDate()
                        }
                    }
                })
            }
        } catch(err) {
            next(err)
        }
    }
}

module.exports = HospitalControllers