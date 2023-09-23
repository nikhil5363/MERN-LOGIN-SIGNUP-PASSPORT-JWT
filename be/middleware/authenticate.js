const jwt = require("jsonwebtoken");
const userdb = require("../models/userSchema");
//const keysecret = process.env.SECRET_KEY
const keysecret = '9e4ce9143797f4525f1e35a27cb2754ddc46f2e96d28aadd2ea1c4b2103bc3e7'


const authenticate = async (req, res, next) => {

    try {
        const token = req.headers.authorization;

        const verifytoken = jwt.verify(token, keysecret);

        const rootUser = await userdb.findOne({ _id: verifytoken._id });

        if (!rootUser) { throw new Error("user not found") }

        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id

        next();

    } catch (error) {
        res.status(401).json({ status: 401, message: "Unauthorized no token provide" })
    }
}

module.exports = authenticate


