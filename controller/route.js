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
router.get('/new/:requrl*', function(req,res){
  var req_url = req.url.slice(5,req.url.length);//get the URL portion after /new/
  console.log('Request URL: '+req_url);

  var urlMatcher = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  //regex to check for valid url
  var regxUrlMatch = new RegExp(urlMatcher);
  console.log(req_url);
  linkGenStore.findOne({'requestURL':req_url},{"__v":0,"_id":0}, function(err,link){ //seaarch if the requested url is already shortened
    if(err) throw err;
    if(link){
      console.log("Request URL already present");
      return res.json(link);//respond with json object
    }
    var linkGen = new linkGenStore();
    var short_url = linkGen.genURL();//generate the short url
    //recursive function to generate unique short url
    function uniqueLinkGen(){
        if(linkGenStore.findOne({'shortURL':short_url})===true){//check if short url is present
        short_url = linkGen.genURL();
        uniqueLinkGen();
      }
      else{
        return short_url;
      }
    }
    if(req_url.match(regxUrlMatch)){//if the request url is valid
      linkGen.requestURL = req_url;
      linkGen.shortURL = uniqueLinkGen();
      console.log(linkGen.shortURL);
      linkGen.save(function(err,link){
        if(err) {
          console.log('Error Inserting New Data');
        if (err.name == 'ValidationError') {
            for (field in err.errors) {
                console.log(err.errors[field].message);
            }
          }
        }
        console.log('success');
        linkGenStore.findOne({'requestURL':link.requestURL},{'__v':0, '_id':0}, function(err,data){ //show the shortened url and original url as json object
          if(err) throw err;
           return res.json(data);
        });
      });
    }
    else{
      return res.json({'url':'invalid'});
    }

  });
});

router.get('/:shorturl', function(req, res,next){
    console.log('Short URL: '+req.params.shorturl);
    linkGenStore.findOne({"shortURL":'https://jasil1414-urlshortner.herokuapp.com/'+ req.params.shorturl}, function(err,data){//get the original url from shortened url
      if(err) throw err;
      if(data){
        var redirect_url = data.requestURL;
        return res.redirect(redirect_url);//redirect to original url
      }
    });
});

module.exports = router;
