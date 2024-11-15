const router = require("express")();
const path = require('path');
router.set('view engine', 'ejs')
router.set('views', path.join(__dirname, '../views'));

router.get("/", (req, res) => {
    res.send('Hello');
    res.render('students', { title: 'Hello World!' });
});

// router.post('/', )

module.exports = router