var mongoose = require('mongoose');
var Schema = require('mongoose/lib/schema');

module.exports = {

	// code model
	Model: mongoose.model(
		'Collection',
		{
			parent_id: {
				type: Schema.Types.ObjectId,
				ref: 'Collection'
			},
			title: String
		}
	),

	get: function(id, callback) {
		this.Model.find({_id: id}, function(err, result) {
			if (err || result.length != 1) return callback(null);
			callback(result[0]);
		});
	}

};
