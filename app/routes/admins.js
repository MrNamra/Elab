const router = require("express")();
const bodyParser = require('body-parser')

router.use(bodyParser.json())

router.get("/", (req, res) => {
    res.send("Admin Side");
});

module.exports = router