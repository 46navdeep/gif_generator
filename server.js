var express = require('express');
var app = express();
app.set('view engine', 'ejs')
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false})
var giphy = require('giphy')('9K7NGrVVg0bbztHnMdyKKd7tD5Ju0pVK');
app.use('/views',express.static('views'));
var events = require('events');
var eventEmitter = new events.EventEmitter();
var gifshot = require('gifshot');
//app.use('/', giphy);




//var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=9K7NGrVVg0bbztHnMdyKKd7tD5Ju0pVK&limit=5");
//xhr.done(function(data) { console.log("success got data", data); });
const MongoClient = require('mongodb').MongoClient
MongoClient.connect('mongodb://navdeep:123@localhost:27017/giphy',function(err,database){
  if(err) return console.log(err);
  db = database
})

app.get('/',function(req,res){
  res.render('home.ejs');
})

app.get('/login',function(req,res){
  res.render('index.ejs');
  })



app.post('/submit',urlencodedParser,function(req,res){
  console.log("The response recorded is");
  response={
    FirstName:req.body.first_name,
    LastName:req.body.last_name
  }
  console.log(response);

db.collection('users').find({  $and:[{username:{$eq:req.body.first_name}},{password:{$eq:req.body.last_name}}]} ).toArray(function(err,items){
    if(err)
    console.log(err);

    if(items[0] === undefined)
    {
      return res.status(404).send('Sorry, we cannot find that!');
    }
    if(items[0] !== undefined)
    {
      console.log(items[0]);
      res.render('wrongpwd.ejs')

    }
});

})
var ans = new Array("empty");
var count;
var chq=0;
app.post('/search',urlencodedParser,function(req,res){
  console.log("You have reached the search section");
  console.log(req.body.keyword);

  console.log(giphy.getMethods());
  giphy.search({ q : [ req.body.keyword ]}, function(err, res) {

     for(count=0 ; count<25 ;count++)
    {
      ans.push(res.data[count].embed_url);
      console.log(ans[count]);
      chq=1;
    }

  });
  setTimeout(function () {
    console.log("I am in");
  res.render('searchresult.ejs',{nav:ans})
}, 8500)
})




app.post('/create',urlencodedParser,function(req,res){
  console.log("You have reached the create section");
  gifshot.isSupported();
gifshot.isWebCamGIFSupported();
gifshot.createGIF({
    gifWidth: 200,
    gifHeight: 200,
    interval: 0.1,
    numFrames: 10,
    frameDuration: 1,
    fontWeight: 'normal',
    fontSize: '16px',
    fontFamily: 'sans-serif',
    fontColor: '#ffffff',
    textAlign: 'center',
    textBaseline: 'bottom',
    sampleInterval: 10,
    numWorkers: 2
}, function (obj) {
  console.log("You have reached the create section1");
    if (!obj.error) {
      console.log("You have reached the create section2");
        var image = obj.image, animatedImage = document.createElement('img');
        animatedImage.src = image;
        document.body.appendChild(animatedImage);
    }
});

})



var server = app.listen(3002,function(){
var host = server.address().address;
var port = server.address().port;
console.log("The server is running at http://%s/%s",host,port);
})
