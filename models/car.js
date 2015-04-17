// db link
var mongoose = require('mongoose');

// define the dealer model (fields and data types)
var CarSchema = new mongoose.Schema({
    plateNumber: String,
    manufacture: String,
    model: String,
	year: String,
	category: String,
	postalCode: String,
	approximateKm: String,
	chargerStation: String,
	duration: String,
	chargeDate: { type: Date, default: Date.now } 
});

// make the model public so other files can access it
module.exports = mongoose.model('Car', CarSchema);