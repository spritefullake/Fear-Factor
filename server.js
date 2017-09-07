var express = require('express');
var app = express();
var pg = require('pg');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});



app.use(express.static(__dirname));

// set the home page route
app.get('/', function(req, res) {

	res.sendFile(__dirname + '/docs/index.html');
});

app.listen(port, function() {
console.log('Our app is running on http://localhost:' + port);
});