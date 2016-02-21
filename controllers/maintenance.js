//////////////////
// Dependencies //
//////////////////

var Express = require('express');
var Rfr = require('rfr');
var Mongoose = require('mongoose');
var Async = require('async');
var Walk = require('walk');

////////////
// Models //
////////////

var Collection = Rfr('./models/collection');
var Config = Rfr('./models/config');
var Item = Rfr('./models/item');

////////////
// Routes //
////////////

var router = Express.Router();

router.get('/', function(req, res) {
	// get all config
	Config.get({}, function (err, configs) {
		res.render('maintenance/index', {
			_: {
				activePage: 'maintenance',
				title: 'Maintenance'
			},
			configs: configs
		});
	});
});

router.get('/scan', function(req, res) {
	// get root collections
	Collection.get({parent_id: null}, function(err, collections) {
		if (err || !collections) {
			res.status(500);
			return res.end();
		}

		// no roots?
		if (!collections.length) {
			return res.json('No roots');
		}

		// walk through the ith directory, then recurse
		var files = {};
		var doWalk = function(i) {
			var c = collections[i];
			files[c._id] = [];

			// walk through files
			var walker = Walk.walk(c.file_path, {});
			walker.on('file', function(root, f, next) {
				var fileName = root.replace(c.file_path, '') + '/' + f.name;
				if (fileName.charAt(0) == '/') fileName = fileName.substr(1);
				files[c._id].push(fileName);
				next();
			});

			walker.on('end', function() {
				if (i == collections.length - 1) {
					// done
					res.json(files);
				} else {
					// recurse
					doWalk(i + 1);
				}
			});
		};

		doWalk(0);
	});
});

module.exports = router;
