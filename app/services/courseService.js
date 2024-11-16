const helper = require("../helpers/helper");
const Course = require("../models/Course");

module.exports = {
    addCourse: async (req, res) => {
        try{
            const course = await Course.create(req.body);
            res.status(200).send({  message: 'Course created successfully!!' });
        } catch (err) {
            const errorResponse = helper.errorLog(err, 'CourseService/addCourse');
            return res.status(400).send(errorResponse);
        }
    },
    getAllCourses: async (req, res) => {
        try{
            const courses = await Course.find({},{"course_name":1, "_id":1, "no_of_sem":1});
            res.status(200).send({ courses });
        } catch (err) {
            const errorResponse = helper.errorLog(err, 'CourseService/getAllCourses');
            return res.status(400).send({ errorResponse });
        }
    }
}