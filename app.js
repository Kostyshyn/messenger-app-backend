import createError from 'http-errors';
import express from 'express'
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import colors from 'colors';
import { connectDB } from '@helpers';

import CONFIG from '@config';

import { api } from '@routes';

const app = express();

// connect DB 

connectDB(CONFIG.DB_URL);

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
app.use((req, res) => {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(err.status).json({
    error: {
      status: err.status,
      request_url: req.originalUrl,
      message: err.message,
      // stack_trace: err.stack.split(/\n/).map(stackTrace => stackTrace.replace(/\s{2,}/g, ' ').trim()),
    }
  });
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  // res.render('error');
  res.json({
    error: err
  });
});

module.exports = app;
