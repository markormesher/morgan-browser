//////////////////
// Dependencies //
//////////////////

var Express = require('express');
var Rfr = require('rfr');
var BodyParser = require('body-parser');
var SassMiddleware = require('node-sass-middleware');
var CookieParser = require('cookie-parser');
var Session = require('express-session');
var Flash = require('express-flash');
var Mongoose = require('mongoose');

var Constants = Rfr('./helpers/constants');
var Secrets = Rfr('./helpers/secrets');

//////////////////////////
// Database connections //
//////////////////////////

Mongoose.connect('mongodb://localhost:27017/morgan-browser');

//////////////////////////
// Express + Middleware //
//////////////////////////

var app = Express();

app.use(BodyParser.urlencoded({ extended: false }));
app.use(SassMiddleware({
	src: __dirname + '/assets/',
	dest: __dirname + '/public/',
	outputStyle: 'compressed'
}));
app.use(CookieParser(Secrets.COOKIE_SECRET));
app.use(Session({
	secret: Secrets.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));
app.use(Flash());

////////////
// Routes //
////////////

var routes = {
	'/': Rfr('./controllers/root'),
	'/dashboard': Rfr('./controllers/dashboard'),
	'/maintenance': Rfr('./controllers/maintenance'),
	'/collections': Rfr('./controllers/collections'),
	'/items': Rfr('./controllers/items')
};

for (var stem in routes) {
	app.use(stem, routes[stem]);
}

// stop favicon requests
app.use('/favicon.ico', function (req, res) {
	res.end();
});

///////////
// Views //
///////////

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(Express.static(__dirname + '/public'));

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

app.listen(Constants.EXPRESS_PORT);