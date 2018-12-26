import express from 'express';
const router = express.Router();

import { authPagesRouter } from './auth-pages';

router.use('/account', authPagesRouter);

router.get('/', (req, res, next) => {
	res.send('EXPRESS APPLICATION')
});

module.exports = router;