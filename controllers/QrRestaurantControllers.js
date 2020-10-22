const {Restaurant} = require('../models/')
const qr = require("qrcode")

class RestaurantController {
    static async getById(req, res, next) {
        const {id} = req.params
        try {
            const restaurant = await Restaurant.findOne({where: {id}})
            if(!restaurant) {
                throw {name: 'DATA_NOT_FOUND'}
            } else {
                const data = 
                {
                    type: 'restaurant',
                    restaurantId: id,
                    name: restaurant.name,
                    email: restaurant.email,
                    address: restaurant.address
                }

                // res.status(200).json({
                //     name: restaurant.name,
                //     email: restaurant.email,
                //     address: restaurant.address
                // })
                const datas = (JSON.stringify(data))
                qr.toDataURL(datas, (err, src) =>
                {
                    // console.log(src);
                    // RENDER TO REACT LATER
                    // res.status(200).json({ restaurant_QR: src })
                    res.render("scan", {src, name: restaurant.name})
                })
            }
        } catch(err) {
            console.log(err, "<<<<<<<<<ERRORR RESTAURANT QR");
            next(err)
        }
    }
}

module.exports = RestaurantController