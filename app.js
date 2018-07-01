var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var helmet = require('helmet');
var compression = require('compression');
var mongoose = require('mongoose');
var colors = require('colors');
var helper = require('./helpers/');

var CONFIG = require('./config');

var api = require('./routes/');

var app = express();

// connect DB 

helper.connectDB(CONFIG.DB_URL);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(compression());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/storage', express.static(path.join(__dirname, 'storage')));

app.use(cors()); // CORS

app.use('/', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  if (err.status != 404){
    console.log(colors.red(err));
  };
  res.json({
    error: err
  });
});

module.exports = app;
