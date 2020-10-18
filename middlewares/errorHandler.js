function errorHandler(err, req, res, next) {
    let errors = []
    let statusCode = 500

    if(err.name === 'SequelizeValidationError') {
        statusCode = 400
        err.errors.forEach(e => {
            errors.push(e.message)
        });
    } else if(err.name === 'PHONE_NOT_UNIQUE') {
        statusCode = 400
        errors.push('Phone Number Already Registered!')
    } else if(err.name === 'EMAIL_NOT_UNIQUE') {
        statusCode = 400
        errors.push('Email Already Registered')
    } else if(err.name === 'LOGIN_FAILED') {
        statusCode = 400
        errors.push('Invalid Phone Number')
    } else if(err.name === 'INVALID_OTP') {
        statusCode = 400
        errors.push('Invalid OTP')
    } else if(err.name === 'LOGIN_FAILED') {
        statusCode = 400
        errors.push('Invalid Email or Password')
    } else if(err.name === 'DATA_NOT_FOUND') {
        statusCode = 404
        errors.push('Data Not Found')
    } else if(err.name === 'LOGOUT_FIRST') {
        statusCode = 400
        errors.push('Please logout first on the previous device')
    } else {
        errors.push('Internal Server Error')
    }
    res.status(statusCode).json({errors})
}

module.exports = errorHandler