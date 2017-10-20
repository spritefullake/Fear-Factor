var express = require('express');
var app = express();
var pg = require('pg');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var connectionString = process.env.DATABASE_URL;
var client = new pg.Client(connectionString);
var pool = new pg.Pool();




app.get('/db', function (request, response) {
  
    pool.query('SELECT * FROM test_table', function clientcb(err, result) {
      //done();
      console.log("IN QUERY");
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { /* response.render('pages/db', {results: result.rows} ); */
          console.log("SUCCESS");}
    });

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


/*
var port = process.env.PORT || 8080;


var connectionString = process.env.DATABASE_URL || "postgres://zcfcmlyvrvkfbu:1f8dc0301e5bd7dd836062219da7f09bfa6ac13c6ecfecccbdff3dd405cd61fc@ec2-184-73-193-230.compute-1.amazonaws.com:5432/da9ngjrei22rh1";
var pool = new pg.Pool(connectionString);
var client = new pg.Client(connectionString);
app.get('/db', function (request, response) {
  pool.connect(function connectioncb(err, c, done) {
    client.query('SELECT * FROM test_table', function clientcb(err, result) {
      done(); //pool.end();
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
	res.sendFile(__dirname + '/dist/index.html');
});

app.listen(port, function() {
console.log('Our app is running on http://localhost:' + port);
});

*/