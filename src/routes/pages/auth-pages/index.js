import express from 'express';
import { confirmation } from '@controllers/AuthPagesController';

const router = express.Router();

router.get('/confirmation', confirmation);

export { router as authPagesRouter };