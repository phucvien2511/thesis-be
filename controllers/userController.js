const User = require('../models/userModel');
const { verifyToken } = require('../middlewares/verifyToken');
const { getTokenFromHeader, createToken } = require('../services/token');
const jwt = require('jsonwebtoken');

// const register = async (req, res) => {
//     const { username, password, birthday } = req.body;
//     try {
//         const user = await User.create({
//             username,
//             password,
//             birthday
//         });

//         res.status(200).json({ data: user, message: "Success" });
//     } catch (error) {
//         // If username is already taken
//         if (error.name === 'SequelizeUniqueConstraintError') {
//             return res.status(400).json({ message: "Username is already taken" });
//         }
//         res.status(400).json({ message: error.message });
//     }
// }

// const login = async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({
//             where: {
//                 username,
//                 password
//             }
//         });

//         if (!user) {
//             return res.status(400).json({ message: "Username or password is incorrect" });
//         }
//         res.status(200).json({ accessToken: createToken(username), message: "Success" });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }

const login = async (req, res) => {
    const { contractCode } = req.body;
    try {
        const user = await User.findOne({
            where: { contractCode }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ accessToken: createToken(contractCode), message: "Success" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getMe = async (req, res) => {
    try {
        const accessToken = getTokenFromHeader(req);
        const contractCode = jwt.decode(accessToken).sub;
        const user = await User.findOne({
            where: { contractCode }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (verifyToken(accessToken) === "EXPIRED") {
            return res.status(401).json({ message: "Session has expired" });
        }
        else if (verifyToken(accessToken) === "INVALID") {
            return res.status(401).json({ message: "Unauthorized" });
        }
        res.status(200).json({ data: user, message: "Success" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

}

module.exports = {
    // register,
    login,
    getMe
}