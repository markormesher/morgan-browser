var mongoose = require('mongoose');
var Schema = require('mongoose/lib/schema');

module.exports = mongoose.model(
	'Item',
	{
		collection_id: {
			type: Schema.Types.ObjectId,
			ref: 'Collection'
		},
		sequence: Number,
		title: String
	}
);