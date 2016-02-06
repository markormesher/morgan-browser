// dependencies

var express = require('express');
var rfr = require('rfr');

// set up server

var app = express();

// set up routes

app.use('/', rfr('./controllers/root.js'));
app.use('/auth', rfr('./controllers/auth.js'));

// start server

app.listen(3000);