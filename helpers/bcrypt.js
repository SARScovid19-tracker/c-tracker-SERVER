const bcrypt = require('bcryptjs')

function hashData(data) {
    let salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(data, salt)
}

function compareHash(data, hash) {
    return bcrypt.compareSync(data, hash)
}

module.exports = {hashData, compareHash}