module.exports = {

	errorRedirect: function(req, res, destination, error) {
		req.flash('error', error);
		res.writeHead(302, {Location: destination});
		res.end();
	}

};