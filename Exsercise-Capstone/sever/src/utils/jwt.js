const jwt = require('jsonwebtoken')
const generateToken = (data) => {
    return jwt.sign({ data }, "17Nb2Wa#", { expiresIn: "1d" })
}

const checkToken = (token) => {
    let check = jwt.verify(token, process.env.JWT_SECRET)
    return check;
}

const verifyToken = (req, res, next) => {
    let { tokencapstone } = req.headers
    if (!tokencapstone) {
        res.status(401).send("Auth failed")
        return;
    }
    try {
        let ckToken = checkToken(tokencapstone);
        if (ckToken) {
            req.user = ckToken;
            next();
        }
    } catch (err) {
        res.status(401).send(err)
    }
}



module.exports = {
    generateToken,
    checkToken,
    verifyToken
}