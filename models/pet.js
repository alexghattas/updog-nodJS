const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const petSchema = new Schema({ // new keyword clones the following argument, representation of the data
	name: String,
	photo: String,
	description: {
		type: String,
		default: ''
	},
	score: {
		type: Number,
		default: 0
	}
});

//Creates or connects a collection called Pet, pluralizes it when there are multiples
module.exports = mongoose.model('Pet', petSchema); 