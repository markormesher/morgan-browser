//////////////////
// Dependencies //
//////////////////

var Express = require('express');
var Rfr = require('rfr');
var Mongoose = require('mongoose');
var Walk = require('walk');
var Fs = require('fs');

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
	 - [getFileList] Mongoose query to get root collections
	 - [getFileList] Root collection file paths are scanned for all media items
	 - [processFileList] Raw list of file paths is turned into tree of collections (with IDs) and items
	 - [processNewContent] Creates the collections that didn't have an ID in the first scan
	 */

	// store root collections
	var rootCollections = {};

	// get root collections, scan files, and feed them to processFileList
	var getFileList = function () {
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

				// store outside this function for later use
				rootCollections[c._id] = c;

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
	};

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
				target.$id = fileName.substr(7);
			} else {
				// add file to the item list
				if (!target.hasOwnProperty('$items')) {
					target.$items = [];
				}
				target.$items.push(fileName);
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
	var processNewContent = function (fileTree) {
		var collectionsToInsert = [];

		// process a collection by inserting or updating if necessary and iterating over children
		var processCollection = function (parentId, name, collection, filePath) {
			var isRoot = parentId == null;
			if (collection.$id == null) {
				// new collection to insert

				// generate and write a new ID
				var newId = Mongoose.Types.ObjectId();
				Fs.closeSync(Fs.openSync(filePath + '/' + name + '/.mb-id-' + newId, 'w'));

				// generate body to insert
				collectionsToInsert.push({
					_id: newId,
					parent_id: parentId,
					title: name,
					NEW: true
				});

				// update parent ID
				parentId = newId;
			} else {
				// collection already exists, so update parent ID
				parentId = collection.$id;
			}

			// iterate over children
			if (collection.hasOwnProperty('$children')) {
				for (var i in collection.$children) {
					processCollection(
						parentId,
						i,
						collection.$children[i],
						isRoot ? filePath : filePath + "/" + name
					);
				}
			}
		};

		// start by processing roots
		for (var i in rootCollections) {
			processCollection(
				null,
				rootCollections[i].title,
				fileTree[i],
				rootCollections[i].file_path
			);
		}

		// insert all of the new collections
		Collection.Model.create(collectionsToInsert, function (err, inserted) {
			if (err) {
				console.log(err);
				res.json('error');
			} else {
				res.json({
					created: inserted ? inserted.length : 0
				});
			}
		});
	};

	// GO!
	getFileList();
});

module.exports = router;
