var express = require ('express');
var mongoose = require('mongoose');

var router = express.Router();
//Get the schema from model
var linkGenStore = require('../model/link');

//the index page
router.get('/',function(req,res){
  res.render('index')
})
//request to shorten the URL
router.get('/new/:requrl*', async function(req,res){
  try {
    var req_url = req.url.slice(5,req.url.length);//get the URL portion after /new/
    console.log('Request URL: '+req_url);

    var urlMatcher = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    //regex to check for valid url
    var regxUrlMatch = new RegExp(urlMatcher);

    // Check if URL is valid
    if(!req_url.match(regxUrlMatch)){
      return res.json({'url':'invalid'});
    }

    // Check if the requested url is already shortened
    var link = await linkGenStore.findOne({'requestURL':req_url},{"__v":0,"_id":0});
    if(link){
      console.log("Request URL already present");
      return res.json(link);//respond with json object
    }

    // Generate new short URL
    var linkGen = new linkGenStore();
    linkGen.requestURL = req_url;

    // Generate unique short URL
    var short_url = linkGen.genURL();
    var existingLink = await linkGenStore.findOne({'shortURL':short_url});
    while(existingLink){
      short_url = linkGen.genURL();
      existingLink = await linkGenStore.findOne({'shortURL':short_url});
    }

    linkGen.shortURL = short_url;
    console.log(linkGen.shortURL);

    // Save the new link
    await linkGen.save();
    console.log('success');

    // Return the shortened URL
    var data = await linkGenStore.findOne({'requestURL':linkGen.requestURL},{'__v':0, '_id':0});
    return res.json(data);

  } catch(err) {
    console.log('Error:', err);
    return res.status(500).json({error: 'Server error', message: err.message});
  }
});

router.get('/:shorturl', async function(req, res,next){
    try {
      console.log('Short URL: '+req.params.shorturl);
      var baseUrl = process.env.BASE_URL || "http://localhost:3000/";
      var data = await linkGenStore.findOne({"shortURL": baseUrl + req.params.shorturl});//get the original url from shortened url
      if(data){
        var redirect_url = data.requestURL;
        return res.redirect(redirect_url);//redirect to original url
      } else {
        return res.status(404).json({error: 'Short URL not found'});
      }
    } catch(err) {
      console.log('Error:', err);
      return res.status(500).json({error: 'Server error', message: err.message});
    }
});

module.exports = router;
