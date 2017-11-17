module.exports = function(io){
    var express = require('express');
    var router = express.Router();
    var mongo = require('mongodb').MongoClient;
    var db;
    
    
    router.get('/', function(req, res){
      mongo.connect('mongodb://kouz:kouz@ds259255.mlab.com:59255/apimensajes', function(err, _db){
        if(err){
            throw err;
        }
        db=_db;
      });
    
        console.log('MongoDB connected...');
        
    
        // Connect to Socket.io
        io.on('connection', function(socket){
            let chat = db.collection('chats');
    
            // Create function to send status
            sendStatus = function(s){
                socket.emit('status', s);
            }
    
            // Get chats from mongo collection
            chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
                if(err){
                    throw err;
                }
    
                // Emit the messages
                socket.emit('output', res);
            });
    
            // Handle input events
            socket.on('input', function(data){
                let name = data.name;
                let message = data.message;
    
                // Check for name and message
                if(name == '' || message == ''){
                    // Send error status
                    sendStatus('Please enter a name and message');
                } else {
                    // Insert message
                    chat.insert({name: name, message: message}, function(){
                        io.emit('output', [data]);
    
                        // Send status object
                        sendStatus({
                            message: 'Message sent',
                            clear: true
                        });
                    });
                }
            });
    
            // Handle clear
            socket.on('clear', function(data){
                // Remove all chats from collection
                chat.remove({}, function(){
                    // Emit cleared
                    socket.emit('cleared');
                });
            });
        });
    
  
    
      res.render('chat' );
    });
    
return router
} ;
