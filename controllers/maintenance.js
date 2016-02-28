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

router.get('/', function (req, res) {
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

router.get('/scan', function (req, res) {

	/*
	 Control flow:
	 - [bottom of function] Mongoose query to get root collections
	 - [Mongoose callback] Root collection file paths are scanned for all media items
	 - [processFileList] Raw list of file paths is turned into tree of collections (with IDs) and items
	 - [processNewContent] Creates the collections that didn't have an ID in the first scan
	 */

	// takes an object input, where each key is the ID of a root collection,
	// and each value is an array of the files in that collection
	var processFileList = function (fileList) {
		var output = {};

		// process a file by equating path chunks to collections
		var processFile = function (rootId, f) {
			// remove leading slashes
			while (f.charAt(0) == '/') f = f.substr(1);

			// create and enter the tree path for each collection in the chunk list
			var chunks = f.split('/');
			var target = output[rootId];
			for (var i = 0; i < chunks.length - 1; ++i) {
				if (!target.$children.hasOwnProperty(chunks[i])) {
					target.$children[chunks[i]] = {
						$id: null,
						$parent_id: target.$id,
						$children: {}
					};
				}
				target = target.$children[chunks[i]];
			}

			// decide what to do with the file
			var fileName = chunks[chunks.length - 1];
			if (fileName.substr(0, 7) == '.mb-id-') {
				// use it as the ID
				target['$id'] = fileName.substr(7);
			} else {
				// add file to the item list
				if (!target.hasOwnProperty('$items')) {
					target['$items'] = [];
				}
				target['$items'].push(fileName);
			}
		};

		// process each root collection
		for (var rootId in fileList) {
			// create root node
			output[rootId] = {
				$id: rootId,
				$children: {}
			};

			// process each file
			var files = fileList[rootId];
			files.forEach(function (f) {
				processFile(rootId, f);
			});
		}

		// feed output to ID assignment
		processNewContent(output);
	};

	// takes a structures file three, with collection IDs
	var processNewContent = function(fileTree) {
		res.json(fileTree);
	};

	// get root collections, scan files, and feed them to processFileList
	Collection.get({parent_id: null}, function (err, collections) {
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
		var doWalk = function (i) {
			var c = collections[i];
			files[c._id] = [];

			// walk through files
			var walker = Walk.walk(c.file_path, {});
			walker.on('file', function (root, f, next) {
				var fileName = root.replace(c.file_path, '') + '/' + f.name;
				if (fileName.charAt(0) == '/') fileName = fileName.substr(1);
				files[c._id].push(fileName);
				next();
			});

			walker.on('end', function () {
				if (i == collections.length - 1) {
					// done
					processFileList(files);
				} else {
					// recurse
					doWalk(i + 1);
				}
			});
		};

		// start file walk
		doWalk(0);
	});
});

module.exports = router;
