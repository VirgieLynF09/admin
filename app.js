//dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//from the tutorial Authenticating Node.js Applications With Passport by Agraj Mangal
//http://code.tutsplus.com/tutorials/authenticating-nodejs-applications-with-passport--cms-21619
var dbConfig = require('./db');
var mongoose = require('mongoose');
// Connect to DB
//mongoose.connect(dbConfig.url);
mongoose.connect('mongodb://admin:admin@ds061298.mongolab.com:61298/admin-account');

var app = express();
var port= process.env.PORT ||8000;
app.listen(port);
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//from the tutorial Authenticating Node.js Applications With Passport by Agraj Mangal
//http://code.tutsplus.com/tutorials/authenticating-nodejs-applications-with-passport--cms-21619
// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');

app.use(require('express-session')({
    secret: 'georgian admin',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

// tell the application which route / controller to use for dealer requests
var home = require('./routes/home');
app.use('/', home);

//route to the Output message when a user is accessing the page that is not a member 
var message = require('./routes/message');
app.use('/', message);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
