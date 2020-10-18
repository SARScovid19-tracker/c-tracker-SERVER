const {UserRestaurant, Restaurant} = require('../models/')

class UserRestaurantControllers {
    static async create(req, res, next) {
        const {userId, restaurantId} = req.body
        try {
            const addUserRestaurant = await UserRestaurant.create({
                userId, restaurantId
            })
            res.status(201).json({message: 'Add Restaurant History Success', addUserRestaurant})
        } catch(err) {
            next(err)
        }
    }
    static async getByUserId(req, res, next) {
        const {userId} = req.params
        try {
            const history = await UserRestaurant.findAll({
                include: [Restaurant],
                where: {userId}
            })
            res.status(200).json({history})
        } catch(err) {
            next(err)
        }
    }
}

module.exports = UserRestaurantControllers