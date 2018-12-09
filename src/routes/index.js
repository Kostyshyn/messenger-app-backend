import express from 'express';
const router = express.Router();
const apiRouter = require(`./api_v${ process.env.API_VERSION }`);

router.use('/api', apiRouter);

export { router as api };