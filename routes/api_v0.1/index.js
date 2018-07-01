var express = require('express');
var router = express.Router();

var userRouter = require('./users');
var authRouter = require('./auth');

router.use('/', authRouter);
router.use('/users', userRouter);

module.exports = router;
