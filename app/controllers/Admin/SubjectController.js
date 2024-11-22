require('dotenv').config();
const helper = require("../../helpers/helper");
const subjectService = require("../../services/subjectService");

module.exports = {
    getAllSubjects: (req, res) => {
        try {
            subjectService.getAllSubjects(req, res);
        } catch (err) {
            const errorResponse = helper.errorLog(err, 'SubjectController/getAllSubjects');
            res.status(400).send({ errorResponse });
        }
    },
    addSubject: (req, res) => {
        try {
            subjectService.addSubject(req, res);
        } catch (err) {
            const errorResponse = helper.errorLog(err, 'SubjectController/addSubject');
            res.status(400).send({ errorResponse });
        }
    },
    updateSubject: (req, res) => {
        try {
            subjectService.updateSubject(req, res);
        } catch (err) {
            const errorResponse = helper.errorLog(err, 'SubjectController/updateSubject');
            res.status(400).send({ errorResponse });
        }
    },
    addSubjectData: async (req, res) => {
        try {
            await subjectService.addSubjectData(req, res);
        } catch (err) {
            const errorResponse = helper.errorLog(err, 'SubjectController/addSubjectData');
            res.status(400).send({ errorResponse });
        }
    }
}