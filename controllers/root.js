var express = require('express');
var router = express.Router();
router.get('/', function (req, res) {
	res.writeHead(301, {Location: '/dashboard'}).end();
});
module.exports = router;