require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = {
    jwtAuthMiddleware : (req, res, next) => {
        const authorization = req.headers.authorization || req.headers['authorization'];
        if(!authorization) return res.status(401).json({ message: 'Identity Missing' });
    
        // extract toekn from header
        const token = authorization.split(' ')[1];
        if(token)
            return res.status(401).json({ message: 'unidentify Identity' });
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: 'something wrong with Identity!' });
        }
    },

    generateToken : (userData) => {
        const ucode = crypto.randomBytes(16).toString('hex');
        userData.ucode = ucode;
        return jwt.sign(userData, process.env.JWT_SECRET);
        // for expeired
        // return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '0.1h' });
    }
}