const helper = require("./app/helpers/helper");
const app = require("express")();
require('dotenv').config()
require('./app/config/db.conf')

const AdminController = require('./app/controllers/Admin/AdminController');
const StudentController = require('./app/controllers/Student/StudentController');
const studentsRoutes = require('./app/routes/students');
const AdminRoutes = require('./app/routes/admins');

// Body parser
const bodyParser = require('body-parser');
const { adminMiddleware } = require('./app/middleware/checkAdmin');
const studentMiddleware = require('./app/middleware/checkStudent');

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

if(process.env.ADMIN_REG == 'true'){
    app.post('/api/register', AdminController.register)
}

app.post('/api/admin/login', AdminController.login)

// Routes
app.use('/api/admins', adminMiddleware, AdminRoutes);
app.use('/api', studentMiddleware, studentsRoutes);
// app.use('/api', studentsRoutes);

app.use((req, res) => {
    res.status(404).json({ message: '404 Not Found!' });
});

app.listen(PORT, () => {
    console.log("Server Running on PORT: ", PORT);
});
