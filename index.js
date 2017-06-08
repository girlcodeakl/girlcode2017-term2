//set up
var express = require('express')
var app = express();
var bodyParser = require('body-parser')

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
  post.message = request.body.message;
  post.image = request.body.image;
  post.author = request.body.author;
  console.log(request.body.author);
  posts.push(post);
  response.send("thanks for your message. Press back to add another");
}
app.post('/posts', saveNewPost);


//listen for connections on port 3000
app.listen(3000);
console.log("Hi! I am listening at http://localhost:3000");
