const express = require('express');
const layouts = require('express-ejs-layouts');
const fs = require('fs');

const PORT = 3000;
const methodOverride = require('method-override');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(layouts);
app.use(express.static(__dirname + '/static'));
app.use(methodOverride('_method'));


app.get('/', function(req, res) {
  res.send('You hit the root route, we should make this nicer');
});

app.get('/articles', function(req, res) {
  var articles = fs.readFileSync("./articles.json");
  var articleData = JSON.parse(articles);
  res.render('articles/index', {articleData});
});

app.get('/articles/new', function(req, res) {
  res.render('articles/new');
});

app.get('/articles/:id/edit', function(req, res) {
  let articles = fs.readFileSync("./articles.json");
  let articleData = JSON.parse(articles);
  let id = parseInt(req.params.id);
  res.render('articles/edit', {article: articleData[id], id});
});


app.get("/articles/:id", function(req, res) {
  var articles = fs.readFileSync("./articles.json");
  var articleData = JSON.parse(articles);
  var id = parseInt(req.params.id);
  res.render('articles/show', {article : articleData[id], id});
});


app.post('/articles', function(req, res) {
  // read in our JSON file
  let articles = fs.readFileSync("./articles.json");
  // convert it to an array
  let articleData = JSON.parse(articles);
  // push our new data into the array
  let newArticle = {
    title: req.body.articleTitle,
    body: req.body.articleBody
  };
  articleData.push(newArticle);
  // write the array bakc to the file
  fs.writeFileSync('./articles.json', JSON.stringify(articleData));
  // redirect to our Dino list
  res.redirect('/articles');
});

app.delete('/articles/:id', function(req, res) {
  // Read the data from the file
  let articles = fs.readFileSync("./articles.json");
  // Parse the data into an object
  let articleData = JSON.parse(articles);
  // Splice out the item at the specified index
  var id = parseInt(req.params.id);
  articleData.splice(id, 1);
  // Stringify the object
  var articleString = JSON.stringify(articleData);
  // Write the object back to the file
  fs.writeFileSync('./articles.json', articleString);
  // redirect to our Dino list
  res.redirect('/articles');
});

app.put('/articles/:id', function(req, res) {
  let articles = fs.readFileSync('./articles.json');
  let articleData = JSON.parse(articles);
  var id = parseInt(req.params.id);
  articleData[id].title = req.body.articleTitle;
  articleData[id].body = req.body.articleBody;
  fs.writeFileSync('./articles.json', JSON.stringify(articleData));
  res.redirect('/articles/' + id);
})


app.listen(PORT || 3000, function() {
  console.log('Up and running on port: ' + PORT);
});