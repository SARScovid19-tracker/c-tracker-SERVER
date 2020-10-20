const {Hospital} = require('../models/')
const {compareHash} = require('../helpers/bcrypt')
const {generateToken} = require('../helpers/jwt')
const qr = require("qrcode")

class HospitalControllers {
    static async getById(req, res, next) {
        const {id} = req.params
        try {
            const hospital = await Hospital.findOne({where: {id}})
            if(!hospital) {
                throw {name: 'DATA_NOT_FOUND'}
            } else {
                const data = 
                {
                    type: 'hospital',
                    hospitalId: id,
                    name: hospital.name,
                    email: hospital.email,
                    address: hospital.address
                }
                // res.status(200).json({data})
                const datas = (JSON.stringify(data))
                // console.log(datas, '<<<< data before becoming QR');
                qr.toDataURL(datas, (err, src) =>
                {
                    // console.log(src);

                    // RENDER TO REACT LATER
                    res.status(200).json({ hospital_QR: src })
                    // res.render("scan", {src})
                })
            }
        } catch(err) {
            next(err)
        }
    }
}

module.exports = HospitalControllers