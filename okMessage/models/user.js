var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var edge = require('edge');
var Variable = edge.func({
    assemblyFile: "Dlls/Cifrado.dll",
    typeName: "Cifrado.SDES",
    methodName: "cifrado"
  });

var userSchema = mongoose.Schema({
  local: {
    name: String,
    username: String,
    password: String,
  },
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  console.log(password);
  console.log(this.local.password);
  Variable(password, function (error, result) {
    if(error) throw error;
     console.log(result);
     password = result; 
 });
 if(password === this.local.password){
   return true;
 }
 else{
   return false;
 }

};

module.exports = mongoose.model('User', userSchema);
