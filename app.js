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
import database from '@database';
import { protectedRoute } from '@helpers';

import { api } from '@routes';

const app = express();

// connect DB 

database.connect(process.env.DB_URL);

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
app.use('/storage', protectedRoute, express.static(path.join(__dirname, 'storage')));

app.use(cors()); // CORS

app.use('/', api);

// catch 404 and forward to error handler
app.use((req, res) => {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(err.status).json({
    status: err.status,
    success: false, 
    errors: [
      {
        param: 'url',
        value: req.originalUrl,
        msg: err.message
        // stack_trace: err.stack.split(/\n/).map(stackTrace => stackTrace.replace(/\s{2,}/g, ' ').trim()),
      }
    ]
  });
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.MODE === 'development' ? err : {};
  res.status(err.status || 500);
  // res.render('error');
  console.log(err, process.env.MODE === 'development')
  res.json({
    error: 'Internal Server Error'
  });
});

module.exports = app;
