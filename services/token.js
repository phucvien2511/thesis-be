const jwt = require('jsonwebtoken');

const _EXPIRE_PERIOD_MINUTES = 360; // Minutes

const createToken = (username) => {
    const timestamp = Date.now();
    const payload = {
        sub: username,
        iat: Math.floor(timestamp / 1000),
        exp: Math.floor(timestamp / 1000) + (60 * _EXPIRE_PERIOD_MINUTES), // Expires in [_EXPIRE_PERIOD_MINUTES] minutes
    };
    return jwt.sign(payload, process.env.JWT_SECRET);
}

const getTokenFromHeader = (req) => {
    const token = req.header.authorization.split(' ')[1];
    return token;
}

module.exports = {
    createToken,
    getTokenFromHeader,
}