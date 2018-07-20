import express from 'express';
import { protectedRoute } from '@helpers';

const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		'title': 'Hello from users route!'
	});
});
router.get('/protected', protectedRoute, (req, res, next) => {
	res.status(200).json({
		'title': 'Hello from protected route!'
	});
});

export { router as userRouter };