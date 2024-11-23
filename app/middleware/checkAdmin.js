const helper = require('../helpers/helper');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = {
    adminMiddleware: async (req, res, next) => {
        try{
            const authorization = req.headers.authorization || req.headers['authorization'];
            if(!authorization) return res.status(401).json({ message: 'Identity Missing' });
        
            // extract token from header
            const token = authorization.split(' ')[1];
            if(!token)
                return res.status(401).json({ message: 'unidentify Identity' });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const admin = await Admin.findOne({ ucode: decoded.id });
            
            // Check if ucode has expired (more than 1 hour old)
            if (admin && admin.ucode && admin.ucodeUpdatedAt) {
                const hoursSinceUpdate = (new Date() - admin.ucodeUpdatedAt) / (1000 * 60 * 60);
                if (hoursSinceUpdate >= 1) {
                    // Clear the expired ucode
                    await Admin.updateOne(
                        { _id: admin._id },
                        { 
                            $set: { 
                                ucode: null,
                                ucodeUpdatedAt: null
                            }
                        }
                    );
                    return res.status(401).json({ message: 'Session expired. Please login again.' });
                }
            }

            if(!admin) return res.status(404).json({ message: 'Invalid Identity or session expired.' });
            if(admin.role !== 1) return res.status(403).json({ message: 'Forbidden: Admins only' });

            req.admin = admin;
            next();
        } catch(err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ errorResponse: {message: 'Session expired. Please login again.' }});
            }
            const errorResponse = helper.errorLog(err, 'middleware/checkAdmin');
            res.status(500).send({ errorResponse });
        }
    }
}