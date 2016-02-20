var Express = require('express');
var router = Express.Router();
router.get('/', function (req, res) {
	res.writeHead(301, {Location: '/dashboard'});
	res.end();
});
module.exports = router;