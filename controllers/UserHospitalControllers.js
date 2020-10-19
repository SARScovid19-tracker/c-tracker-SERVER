const {UserHospital, User, Hospital} = require('../models/')

class UserHospitalControllers {
    static async create(req, res, next) {
        const {userId, hospitalId, testingType} = req.body
        try {
            const addUserHospital = await UserHospital.create({
                userId, hospitalId, testingType, isWaitingResult: true
            })
            res.status(201).json({message: 'Add Hospital History Success', addUserHospital})
        } catch(err) {
            next(err)
        }
    }
    static async getByUserId(req, res, next) {
        const {userId} = req.params
        try {
            const history = await UserHospital.findAll({
                include: [Hospital],
                attributes: ['id', 'userId', 'hospitalId', 'isWaitingResult', 'publishedAt', 'createdAt'],
                where: {userId}
            })
            res.status(200).json({history})
        } catch(err) {
            next(err)
        }
    }
    static async getByHospitalId(req, res, next) {
        const {hospitalId} = req.params
        try {
            const data = await UserHospital.findAll({
                include: [User],
                attributes: ['id', 'userId', 'testingType', 'hospitalId', 'createdAt', 'publishedAt'],
                where: {hospitalId}
            })
            res.status(200).json({data})
        } catch(err) {
            console.log(err)
            next(err)
        }
    }
}

module.exports = UserHospitalControllers