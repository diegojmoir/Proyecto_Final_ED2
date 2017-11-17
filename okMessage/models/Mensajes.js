var mongoose = require('mongoose');


var mensajeSchema = mongoose.Schema({
	nick: String,
	msg: String,
	created: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Mensajes', mensajeSchema);

