const {Restaurant} = require('../models/')

class RestaurantController {
    static async getById(req, res, next) {
        const {id} = req.params
        try {
            const restaurant = await Restaurant.findOne({where: {id}})
            if(!restaurant) {
                throw {name: 'DATA_NOT_FOUND'}
            } else {
                res.status(200).json({
                    name: restaurant.name,
                    email: restaurant.email,
                    address: restaurant.address
                })
            }
        } catch(err) {
            next(err)
        }
    }
}

module.exports = RestaurantController