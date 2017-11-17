var mongoose = require("mongoose");
var Mensaje = require("../models/Mensajes");
var MensajeController = {};
MensajeController.getOldMsgs = function(limit, cb){
	var query = Mensaje.find({});
	query.sort('-created').limit(limit).exec(function(err, docs){
		cb(err, docs);
	});
}

MensajeController.saveMsg = function(data, cb){
	var newMsg = new Mensaje({msg: data.msg, nick: data.nick});
	newMsg.save(function(err){
		cb(err);
	});
};
module.exports = MensajeController;