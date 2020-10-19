const {Hospital, User, UserRestaurant, UserHospital, Sequelize} = require('../models/')
const {compareHash} = require('../helpers/bcrypt')
const {generateToken} = require('../helpers/jwt')
const { Op } = require('sequelize')
const moment = require('moment')
const sendPushNotification = require('../helpers/notification')

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
            if(status === 'Negative') {
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
                async function userList(item) {
                    let data = UserRestaurant.findAll({
                        include: [User],
                        where: {
                            restaurantId: item.restaurantId,
                            createdAt: {
                                [Op.between]: [moment(item.createdAt).subtract(3, 'hours').toDate(), moment(item.createdAt).set({h: 23, m: 59, s: 59}).toDate()]
                            },
                            userId: {
                                [Op.not]: item.userId
                            }
                        }
                    })
                    return data
                }
                const output = await Promise.all(
                    restaurantList.map(userList)
                )
                let devId = []
                output.forEach(data => {
                    if(data.length !== 0) {
                        devId.push(`ExponentPushToken[${data[0].User.deviceId}]`)
                    }
                })
                // sendPushNotification(devId)
                res.status(200).json({message: 'Success Send Notification'})
            }
        } catch(err) {
            console.log(err)
            next(err)
        }
    }
}

module.exports = HospitalControllers