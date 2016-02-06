module.exports = {

	errorToDashboard: function(req, res, error) {
		req.flash('error', error);
		res.writeHead(302, {Location: '/'});
		res.end();
	}

};