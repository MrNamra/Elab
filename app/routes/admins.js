const router = require("express")();
const AdminController = require("../controllers/Admin/AdminController");
const AiController = require("../controllers/Admin/AiController");
const StudentController = require("../controllers/Admin/StudentController");
const SubjectController = require("../controllers/Admin/SubjectController");

router.get("/dashboard", AdminController.index);

// courses routes
router.get("/get-all-courses", AdminController.getAllCourses);
router.post("/add-course", AdminController.addCourse);

// subjects routes
router.get("/get-subjects", SubjectController.getAllSubjects);
router.put("/update-subject", SubjectController.updateSubject);
router.post("/add-subject", SubjectController.addSubject);

// students routes
router.post("/add-students", StudentController.addStudents);
router.put("/edit-student", StudentController.editStudent);
router.post("/add-student", StudentController.addStudent);
router.post("/promoteDemoteStudents", StudentController.promoteDemoteStudents);

// store subject Unit data routes
router.post("/add-subject-data", SubjectController.addSubjectData);
router.get("/get-subject-data", SubjectController.getSubjectData);
router.post("/genrateData", AiController.SendDataToAI);

module.exports = router