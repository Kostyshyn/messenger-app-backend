import express from 'express';
const router = express.Router();
const apiRouter = require(`./api_v${ process.env.API_VERSION }`);
const pagesRouter = require('./pages');

router.use('/api', apiRouter);
router.use('/', pagesRouter);

export { router };