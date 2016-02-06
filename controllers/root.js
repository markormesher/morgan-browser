// dependencies

var express = require('express');

// routes

var router = express.Router();

router.get('/', function (req, res) {
    res.json([1, 2, 3, 40]);
});

module.exports = router;