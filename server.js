'use strict'

// dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Comment = require('./model/comment');

// create instances
var app = express();
var router = express.Router();

// set port num
var port = process.env.API_PORT || 3001;

// database config
var mongoDB = 'mongodb://huongng:thienhuong311@ds257077.mlab.com:57077/huongdb'
mongoose.connect(mongoDB, { useMongoClient: true });;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// configure body-parser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  
    //and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
})

// set route path & initialize API
router.get('/', function(req, res) {
    res.json({ message: 'API initialized' });
});

//adding the /comments route to our /api router
router.route('/comments')
  //retrieve all comments from the database
  .get(function(req, res) {
    //looks at our Comment Schema
    Comment.find(function(err, comments) {
      if (err)
        res.send(err);
      //responds with a json object of our database comments.
      res.json(comments)
    });
  })
  //post new comment to the database
  .post(function(req, res) {
    var comment = new Comment();
    //body parser lets us use the req.body
    comment.author = req.body.author;
    comment.text = req.body.text;

    comment.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Comment successfully added!' });
    });
  });

// use the router configuration when calling /api
app.use('/api', router);

// start the server and listens for requests
app.listen(port, function() {
    console.log(`api running on port ${port}`);
});