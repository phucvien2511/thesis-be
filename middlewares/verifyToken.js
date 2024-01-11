const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return "VALID";
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return "EXPIRED";
        }
        return "INVALID";
    }
}

module.exports = {
    verifyToken,
}