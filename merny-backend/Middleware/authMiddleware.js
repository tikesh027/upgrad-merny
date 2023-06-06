const JWT = require('jsonwebtoken');
const { JWT_TOKEN_SALT } = require('../constant/constant');


exports.authMiddleware = (req, res, next) => {
    const authToken = req.get('X-Authorization');
    if(!authToken){
        res.status(400).json({ msg: "Invalid Authentication" });
        return;
    };

    try{
        const decodedToken = JWT.verify(authToken, JWT_TOKEN_SALT);
        if(!decodedToken) {
            res.status(401).json({ msg: "Please Login First to access the Endpoint !!" });
            return;
        }
        req.userId = decodedToken._id;
    }

    catch (error){
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" });
        return;
    }

    next();
}