var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//define the schema
var linkSchema = new Schema({
  requestURL : {type: String , required:true},
  shortURL : {type: String, required:true}
});

linkSchema.methods.genURL = function(){
  var baseUrl = process.env.BASE_URL || "http://localhost:3000/";
  var genUrl = baseUrl;
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"//generate url based on these characters
  for(i=0; i<=6; i++){//6 characters
    genUrl += possible.charAt(Math.floor(Math.random()*possible.length));

  }
  return genUrl;
}
module.exports = mongoose.model('Link', linkSchema);
