const express = require('express');
const router = express.Router();


//Routes
router.get('', (req, res) => {
    res.send("Quero que vc se fodaaa!");
});


module.exports = router;