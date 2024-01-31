//Here we create Token for each...

const jwt = require("jsonwebtoken");

// reset token
module.exports.genearateToken = function (id) {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '15m' })
}

// Activation token
module.exports.genearateActiveToken = function (email) {
    return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '2d' })
}

// Session token
module.exports.genearateSessionToken = function (id) {
    return jwt.sign({ id }, process.env.SECRET_KEY)
}

// verify token
module.exports.verifyToken = function (token) {
    return jwt.verify(token, process.env.SECRET_KEY)
}
