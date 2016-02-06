var mongoose = require('mongoose'),
	Schema = require('mongoose/lib/schema'),
	rfr = require('rfr');

var ItemMeta = rfr('./models/item_meta');

module.exports = {

	Model: mongoose.model(
		'Item',
		{
			collection_id: {
				type: Schema.Types.ObjectId,
				ref: 'Collection'
			},
			sequence: Number,
			title: String
		}
	),

	get: function(id, callback) {
		// get item
		this.Model.find({_id: id}, function(err, item) {
			if (err || item.length != 1) return callback(null);
			item = item[0];

			// get meta
			item = item.toObject();
			item.meta = {};
			ItemMeta.get(item._id, function(meta) {
				if (meta != null) {
					for (var i in meta) {
						item.meta[meta[i].key] = meta[i].value;
					}
				}
				callback(item);
			});
		});
	}

};
