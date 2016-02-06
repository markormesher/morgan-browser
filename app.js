//////////////////
// Dependencies //
//////////////////

var express = require('express'),
rfr = require('rfr'),
sassMiddleware = require('node-sass-middleware'),
cookieParser = require('cookie-parser'),
session = require('express-session'),
flash = require('express-flash'),
mongoose = require('mongoose');

//////////////////////////
// Database connections //
//////////////////////////

mongoose.connect('mongodb://localhost/morgan-browser');

//////////////////////////
// Express + Middleware //
//////////////////////////

var app = express();

app.use(sassMiddleware({
	src: __dirname + '/assets/',
	dest: __dirname + '/public/',
	outputStyle: 'compressed'
}));
app.use(cookieParser('morgan-browser'));
app.use(session({
	secret: '6e227dd1-fad3-4c8c-b947-4c890d37b4e3',
	resave: false,
	saveUninitialized: true
}));
app.use(flash());

////////////
// Routes //
////////////

var routes = {
	'/': rfr('./controllers/root'),
	'/auth': rfr('./controllers/auth'),
	'/dashboard': rfr('./controllers/dashboard'),
	'/collections': rfr('./controllers/collections'),
	'/settings': rfr('./controllers/settings')
};

for (var stem in routes) {
	app.use(stem, routes[stem]);
}

// stop favicon requests
app.use('/favicon.ico', function(req, res) { res.end(); });

///////////
// Views //
///////////

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

////////////
// Errors //
////////////

// 404 handler and forward to main error handler
app.use(function (req, res, next) {
	var err = new Error('Not found');
	err.status = 404;
	err.message = 'Not found';
	next(err);
});

app.use(function (err, req, res, next) {
	err.status = err.status || 500;
	res.status(err.status);
	res.json(err);
});

////////////
// Start! //
////////////

app.listen(3000);

