require('dotenv').config();
const helper = require("../../helpers/helper");
const adminService = require("../../services/adminService");
const courseService = require("../../services/courseService");
const subjectService = require("../../services/subjectService");

module.exports = {
    register: (req, res) => {
        try{
            if(process.env.ADMIN_REG){
                adminService.register(req, res);
            }else{
                res.status(404).send('');
            }
        } catch (error) {
            const errorResponse = helper.errorLog(err, 'AdminController/register');
            res.status(400).send({ errorResponse }, 400);
        }
    },
    login: (req, res) => {
        try{
            adminService.login(req, res);
        } catch (error) {
            const errorResponse = helper.errorLog(err, 'AdminController/login');
            res.status(400).send({ errorResponse }, 400);
        }
    },
    index: (req, res) => {
        try{
            adminService.index(req, res);
        } catch(err) {
            const errorResponse = helper.errorLog(err, 'AdminController/index');
            res.status(400).send({ errorResponse }, 400);
        }
    },
    addCourse: (req, res) => {
        try{
            courseService.addCourse(req, res);
        } catch(err) {
            const errorResponse = helper.errorLog(err, 'AdminController/addCourse');
            res.status(400).send({ errorResponse }, 400);
        }
    },
    getAllCourses: (req, res) => {
        try{
            courseService.getAllCourses(req, res);
        } catch(err) {
            const errorResponse = helper.errorLog(err, 'AdminController/getAllCourses');
            res.status(400).send({ errorResponse }, 400);
        }
    },
}