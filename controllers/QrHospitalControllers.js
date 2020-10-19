const {Hospital} = require('../models/')
const {compareHash} = require('../helpers/bcrypt')
const {generateToken} = require('../helpers/jwt')
const qr = require("qrcode")

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
                    res.status(200).json({message: 'Login Success', token,
                    hospitalId: data.id})
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
                const data = 
                {
                    name: hospital.name,
                    email: hospital.email,
                    address: hospital.address
                }
                // res.status(200).json({data})
                const datas = (JSON.stringify(data))
        
                qr.toDataURL(datas, (err, src) =>
                {
                    if(err) 
                    {
                        res.send ("Error Data")
                        console.log(err);
                    }
                    // console.log(src);
                    res.render("scan", {src})
                })
            }
        } catch(err) {
            next(err)
        }
    }
}

module.exports = HospitalControllers