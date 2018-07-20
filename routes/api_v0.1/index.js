import express from 'express';
const router = express.Router();

import { userRouter } from './users';
import { authRouter } from './auth';

router.use('/', authRouter);
router.use('/users', userRouter);

module.exports = router;