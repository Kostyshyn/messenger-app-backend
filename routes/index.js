var express = require('express');
var router = express.Router();
var CONFIG = require('../config/');

var apiRouter = require(`./api_v${ CONFIG.API_VERSION }`);

router.use('/api', apiRouter);

module.exports = router;