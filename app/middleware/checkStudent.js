function checkStudent(req, res, next) {
    if (req.session && req.session.user) {
        if (typeof req.session.user.en_no !== undefined) {
            const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).replace(/^::ffff:/, '');
            // User is logged from currect IP
            if (req.session.user.ip != clientIp) {
                
            }
            return next();
        } else {
            // User is logged in but not an admin
            return res.status(403).json({ message: 'Access denied.' });
        }
    } else {
        return res.render('errors/403')
    }
}

module.exports = checkStudent