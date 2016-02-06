var mongoose = require('mongoose');
var Schema = require('mongoose/lib/schema');

module.exports = {

	Model: mongoose.model(
		'ItemMeta',
		{
			item_id: {
				type: Schema.Types.ObjectId,
				ref: 'Item'
			},
			key: String,
			value: String
		}
	),

	get: function(itemId, callback) {
		this.Model.find({item_id: itemId}, function(err, result) {
			callback(err ? null : result);
		});
	}

};
