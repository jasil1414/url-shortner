var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var linkSchema = new Schema({
  requestURL : {type: String , required:true},
  shortURL : {type: String, required:true}
});

linkSchema.methods.genURL = function(){
  var genUrl="https://jasil1414-urlshortner.herokuapp.com/";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for(i=0; i<=6; i++){
    genUrl += possible.charAt(Math.floor(Math.random()*possible.length));

  }
  return genUrl;
}
module.exports = mongoose.model('Link', linkSchema);
