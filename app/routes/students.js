const router = require("express")();
const path = require('path');

router.get("/", (req, res) => {
    res.status(200).json({ title: 'Hello World!' });
});

// router.post('/', )

module.exports = router