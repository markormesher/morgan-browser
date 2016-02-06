// dependencies

var express = require('express');

// routes

var router = express.Router();

router.get('/', function (req, res) {
    res.writeHead(301, {Location: '/auth/login'});
    res.end();
});

router.get('/login', function (req, res) {
    res.json([432, 5327]);
});

module.exports = router;