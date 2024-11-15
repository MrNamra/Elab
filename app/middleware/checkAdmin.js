const helper = require('../helpers/helper');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = {
    adminMiddleware: async (req, res, next) => {
        try{
            const authorization = req.headers.authorization || req.headers['authorization'];
            if(!authorization) return res.status(401).json({ message: 'Identity Missing' });
        
            // extract toekn from header
            const token = authorization.split(' ')[1];
            if(!token)
                return res.status(401).json({ message: 'unidentify Identity' });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const admin = await Admin.findOne({ ucode: decoded.id });
            if(!admin) return res.status(404).json({ message: 'Invalid Identity or session expired.' });

            if(admin.role !== 1) return res.status(403).json({ message: 'Forbidden: Admins only' });

            req.admin = admin;
            next();
        } catch(err) {
            helper.errorLog(err, 'middleware/checkAdmin');
            console.log(err);
            return res.status(404).json({ message: 'Invalid Identity or session expired.' });
        }
    }
}