require('dotenv').config();
const helper = require("../helpers/helper");
const app = require("express")();
const Admin = require("../models/Admin");
const adminService = require("../services/adminService");

module.exports = {
    register: (req, res) => {
        try{
            if(process.env.ADMIN_REG){
                adminService.register(req, res);
            }else{
                res.status(404).send('');
            }
        } catch (error) {
            helper.errorLog(error, 'AdminController/register');
            console.log(error);
            res.status(500).send('An error occurred');
        }
    },
    login: (req, res) => {
        try{
            adminService.login(req, res);
        } catch (error) {
            helper.errorLog(error, 'AdminController/login');
            console.log(error);
            res.status(500).send('An error occurred');
        }
    }
}