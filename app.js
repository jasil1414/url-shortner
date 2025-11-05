var express = require('express');
var mongoose = require('mongoose');

var port = process.env.PORT||3000;
var routes = require('./controller/route')
var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://root:Shipwaves2016@alcc.db15u4z.mongodb.net/url-shortener?retryWrites=true&w=majority&appName=ALCC')
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err.message);
    console.log('Server will continue running but database operations will fail');
  });

mongoose.connection.on('error', function(err) {
  console.log('MongoDB runtime error:', err);
});

app.set('view engine','pug');
app.set('views', './views');

app.use('/', routes);
app.listen(port);
console.log("Listening on: " + port);
