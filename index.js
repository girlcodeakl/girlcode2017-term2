//set up
var database = null;
var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var Filter = require('bad-words'),
  filter = new Filter();

//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//make an empty list
var posts = [];

//let a client GET the list
var sendPostsList = function (request, response) {
  response.send(posts);
}
app.get('/posts', sendPostsList);

//let a client POST something new
var saveNewPost = function (request, response) {

  var post = {};
  post.message = (filter.clean(request.body.message));
  if(request.body.image==="") {
    post.image = "https://media.licdn.com/mpr/mpr/AAEAAQAAAAAAAAVNAAAAJGExYTBkMWQyLWM4MTQtNGE3MC04YzZkLTdkZWNjMDVhNGFlMA.jpg";
  }else {
    post.image = request.body.image;
    }
    post.time= new Date();
  post.author = (filter.clean(request.body.author));
  post.comments = [];
  post.id = Math.round(Math.random() * 10000);
  console.log(request.body.author);
  posts.push(post);
  response.send("thanks for your message. Press back to add another");
  var dbPosts = database.collection('posts');
  dbPosts.insert(post);

}
app.get('/post', function (req, res) {
  var searchId = req.query.id;
  console.log("Searching for post " + searchId);
  var post = posts.find(x => x.id == searchId);
  res.send(post);
});


app.post('/posts', saveNewPost);
var mongodb = require('mongodb');
var uri = 'mongodb://girlcode:hats123@ds019893.mlab.com:19893/girlcode2017-term2';
mongodb.MongoClient.connect(uri, function(err, newdb) {
  if(err) throw err;
  console.log("yay we connected to the database");
  database = newdb;
  var dbPosts = database.collection('posts');
  dbPosts.find(function (err, cursor) {
    cursor.each(function (err, item) {
      if (item != null) {
        posts.push(item);
      }

    });
  });
});
var commentHandler = function (req, res) {
    console.log(req.body.postId);
    console.log(req.body.comment);
    var post = posts.find(x => x.id == req.body.postId);
    post.comments.push(filter.clean(req.body.comment));
    database.collection("posts").update({id: parseInt (req.body.postId)}, post);
    console.log(post);
   res.send("ok");
}
app.post("/comment", commentHandler);


//listen for connections on port 3000
app.listen(process.env.PORT || 3000);
console.log("Hi! I am listening at http://localhost:3000");
