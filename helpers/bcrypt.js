const bcrypt = require('bcryptjs')

function hashData(data) {
    let salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(data, salt)
}

function compareHash(number, hash) {
    return bcrypt.compareSync(number, hash)
}

module.exports = {hashData, compareHash}