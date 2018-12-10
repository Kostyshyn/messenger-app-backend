import express from 'express';
import { register, login } from '@controllers/AuthController';
import { registerValidator, loginValidator } from '@validators';

const router = express.Router();

router.post('/register', registerValidator(), register);
router.post('/login', loginValidator(), login);

export { router as authRouter };