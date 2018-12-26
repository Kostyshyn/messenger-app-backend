import express from 'express';
import { register, login, confirmation } from '@controllers/AuthController';
import { registerValidator, loginValidator } from '@validators';
import { protectedRoute } from '@helpers';

const router = express.Router();

router.post('/register', registerValidator(), register);
router.post('/login', loginValidator(), login);
router.get('/confirmation', protectedRoute, confirmation);

export { router as authRouter };