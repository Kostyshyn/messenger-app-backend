import express from 'express';
import CONFIG from '@config';
const router = express.Router();
const apiRouter = require(`./api_v${ CONFIG.API_VERSION }`);

router.use('/api', apiRouter);

export { router as api };