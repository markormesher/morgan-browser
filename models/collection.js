var mongoose = require('mongoose');
var Schema = require('mongoose/lib/schema');

module.exports = mongoose.model(
	'Collection',
	{
		parent_id: {
			type: Schema.Types.ObjectId,
			ref: 'Collection'
		},
		title: String
	}
);