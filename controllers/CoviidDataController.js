const axios = require('axios')

class CovidDataController {
    static async getData(req, res, next) {
        try {
            const {data} = await axios.get('https://apicovid19indonesia-v2.vercel.app/api/indonesia/more')
            res.status(200).json({
                positif: data.penambahan.positif,
                dirawat: data.penambahan.dirawat,
                sembuh: data.penambahan.sembuh,
                meninggal: data.penambahan.meninggal,
                tanggal: data.penambahan.tanggal
            })
        } catch(err) {
            next(err)
        }
    }
}

module.exports = CovidDataController