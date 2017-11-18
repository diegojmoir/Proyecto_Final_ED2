module.exports = function(io){
    var express = require('express');
    var router = express.Router();
    var mongo = require('mongodb').MongoClient;
    var db;
    var users = [];
    
    
    router.get('/', isLoggedIn, function(req, res){
      mongo.connect('mongodb://kouz:kouz@ds259255.mlab.com:59255/apimensajes', function(err, _db){
        if(err){
            throw err;
        }
        db=_db;
      });
    
        console.log('MongoDB connected...');
        
    
        
        io.on('connection', function(socket){
            let chat = db.collection('chats');
            // see if can get logged-in user info 
            // didn't get what I thought I would get. are usernames stored with sessions?
            // console.log(socket.request.session.passport);
            socket.on('userConnected', function(username){
                if(users.indexOf(username) < 0){
                    users.push(username);
                }
                io.emit('getCurrentUsers', users);
            });
            
            socket.on('chat message', function(msg){
                // this is the server sending out the message to every client
                
                // get current date and time
                var timestamp = new Date().toLocaleString();
                
                // adding whitespace doesn't work because this message will be surrounded by <li> tags 
                // instead, you can use '\u00A0', the unicode for whitespace 
                // https://stackoverflow.com/questions/12882885/how-to-add-nbsp-using-d3-js-selection-text-method
                
                io.emit('chat message', msg.user + ": " + msg.msg + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 " + timestamp);
            });
            
           
            // Handle input events
            
            socket.on('image', function(img){
                // send all clients the imgData that was sent here (to this server)
                io.emit('image', img);
            });
        });
    
  
    
      res.render('chat',{ user: req.user } );
    });
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
      }
    
return router
} ;
