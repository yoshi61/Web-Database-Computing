var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var sessionStore = require('express-mysql-session');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var config = require('./config');

/* create a 'pool' (group) of connections that can be used for
interacting with the database. 
Set dbUser, password and database in config file
*/

var dbConnectionPool = mysql.createPool(
    { host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database
});


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session( 
          { secret: config.sessionSecret, 
            resave: 'true', 
            saveUninitialized: 'true', 
            store: new sessionStore(
                     { host: config.db.host, 
        		       user: config.db.user, 
        		       password: config.db.pass, 
        		       database: config.db.database 
		     })
	  }));
app.use(express.static(path.join(__dirname, 'public')));

// middleware for accessing database
// do this *before* processing routes in index.js or users.js
// so needs to be *before* the app.use('/', routes);
app.use(function(req, res, next) {
	req.pool = dbConnectionPool;
	next();
    });

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
