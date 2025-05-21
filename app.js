var express = require('express');
var mongoose = require('mongoose');

var port = process.env.PORT||3000;
var routes = require('./controller/route')
var app = express();

mongoose.Promise = global.Promise;
// TODO: Replace with your actual MongoDB connection string
mongoose.connect('YOUR_MONGODB_CONNECTION_STRING_HERE');

app.set('view engine','pug');
app.set('views', './views');

app.use('/', routes);
app.listen(port);
console.log("Listening on: " + port);
