const helper = require("./app/helpers/helper");
const app = require("express")();
require('dotenv').config()
require('./app/config/db.conf')

const AdminController = require('./app/controllers/AdminController');
const StudentController = require('./app/controllers/StudentController');
const studentsRoutes = require('./app/routes/students');
const AdminRoutes = require('./app/routes/admins');

// Body parser
const bodyParser = require('body-parser');
const { adminMiddleware } = require('./app/middleware/checkAdmin');
const studentMiddleware = require('./app/middleware/checkStudent');

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './app/views');

const PORT = process.env.PORT || 3001;

if(process.env.ADMIN_REG){
    app.post('/api/register', AdminController.register)
}
app.post('/api/admin/login', AdminController.login)

// Routes
app.use('/api/admins/*', adminMiddleware, AdminRoutes);
app.use('/api/', studentMiddleware, studentsRoutes);

app.listen(PORT, () => {
    console.log("Server Running on PORT: ", PORT);
});
