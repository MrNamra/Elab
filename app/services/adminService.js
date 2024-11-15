require('dotenv').config();
const helper = require("../helpers/helper");
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
const Admin = require("../models/Admin");
const bcrypt = require('bcrypt');

module.exports = {
    register: async (req, res) => {
        try{
            const salt = await bcrypt.genSalt(10);
            const hashedPwd = await bcrypt.hash(req.body.password, salt);

            req.body.password = hashedPwd;
            const admin = await Admin.create(req.body)
            // res.status(200).send(admin);
            res.status(200).send({ message: 'Admin created successfully!!' });
        } catch (err){
            helper.errorLog(err, 'AdminService/register');
            console.log(err.errorResponse);
            if (err.code === 11000) {
                res.status(400).send({ message: 'Duplicate entry, email already exists.' });
            } else {
                console.log(err);
                res.status(500).send('An error occurred');
            }
        }
    },
    login: async (req, res) => {
        try{
            const admin = await Admin.findOne({ email: req.body.email });
            if (!admin) {
                return res.status(401).send({ message : 'Invalid email or password'});
            }
            const isMatch = await bcrypt.compare(req.body.password, admin.password);
            if (!isMatch) {
                return res.status(401).send({ message : 'Invalid email or password'});
            }
            const ucode = crypto.randomBytes(16).toString('hex')
            admin.ucode = ucode;

            await admin.save();

            const token = jwt.sign({ id: admin.ucode }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).send({ message: "Login Successful!", token: token });
        } catch (err){
            helper.errorLog(err, 'AdminService/login');
            console.log(err);
            res.status(500).send({ message: 'An error occurred' });
        }
    }
}