function errorHandler(err, req, res, next) {
    let errors = []
    let statusCode = 500

    if(err.name === 'SequelizeValidationError') {
        statusCode = 400
        err.errors.forEach(e => {
            errors.push(e.message)
        });
    } else if(err.name === 'LOGIN_FAILED') {
        statusCode = 400
        errors.push('Invalid Phone Number')
    } else if(err.name === 'INVALID_OTP') {
        statusCode = 400
        errors.push('Invalid OTP')
    } else {
        errors.push('Internal Server Error')
    }
    res.status(statusCode).json({errors})
}

module.exports = errorHandler