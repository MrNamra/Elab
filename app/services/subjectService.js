const helper = require("../helpers/helper");
const Subject = require("../models/Subject");

module.exports = {
    addSubject: async (req, res) => {
        try{
            const subject = await Subject.create(req.body);
            res.status(200).json({ message: 'Subject created successfully!' });
        } catch(err) {
            const errorResponse = helper.errorLog(err, 'SubjectService/addSubject');
            return res.status(400).send({errorResponse});
        }
    },
    getAllSubjects: async (req, res) => {
        try {
            const subjects = await Subject.find({})
                .select('_id subject_code subject_name sem course_id')
                .populate('course_id', 'course_name')
                .lean();

            if (!subjects || subjects.length === 0) {
                return res.status(200).json({ 
                    subjects: [],
                    message: "No subject found!" 
                });
            }
            // this response include course_name directly
            const transformedSubjects = subjects.map(subject => ({
                _id: subject._id,
                subject_code: subject.subject_code,
                subject_name: subject.subject_name,
                sem: subject.sem,
                course_id: subject.course_id._id,
                course_name: subject.course_id.course_name
            }));

            res.status(200).json({ subjects: transformedSubjects });
        } catch (err) {
            const errorResponse = helper.errorLog(err, 'SubjectService/getAllSubjects');
            return res.status(400).send({ errorResponse });
        }
    },
    updateSubject: async (req, res) => {
        try{
            const subject = await Subject.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
            res.status(200).json({ message: 'Subject updated successfully!' });
        } catch(err) {
            const errorResponse = helper.errorLog(err, 'SubjectService/updateSubject');
            return res.status(400).send({errorResponse});
        }
    },
    
}