const helper = require('../helpers/helper');
const Student = require('../models/Students');

module.exports = {
    // Student login
    login: async (req, res) => {
        try {
            const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).replace(/^::ffff:/, '');
            
            const student = await Student.findOne({ en_no: req.body.en_no });

            if (!student) {
                return res.status(401).send('Invalid Enrollment Number');
            }

            // Check if the IP matches
            if (student.ip !== clientIp) {
                return res.status(403).send('Access Deny: IP Mismatch');
            }

            // If IP matches, proceed with password authentication
            passport.authenticate('local', (err, student, info) => {
                if (err) {
                    helper.errorLog(err, 'StudentController/login');
                    return res.status(500).send('An error occurred');
                }

                if (!student) {
                    return res.status(401).send(info.message);  // Message from failure
                }

                // Successful login
                req.logIn(student, (err) => {
                    if (err) {
                        return res.status(500).send('An error occurred during session setup');
                    }

                    return res.status(200).send('Login successful');
                });
            })(req, res); // Call Passport authenticate
        } catch (err) {
            helper.errorLog(err, 'StudentController/login');
            res.status(500).send('An error occurred');
        }
    }
};
