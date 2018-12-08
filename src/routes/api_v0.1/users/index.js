import express from 'express';
import { protectedRoute } from '@helpers';
import { getUser, updateUser, deleteUser } from '@controllers/UserController';

const router = express.Router();

// router.get('/', (req, res, next) => {
// 	res.status(200).json({
// 		'title': 'Hello from users route!'
// 	});
// });
// router.get('/protected', protectedRoute, (req, res, next) => {
// 	res.status(200).json({
// 		'title': 'Hello from protected route!'
// 	});
// });

router.get('/:href', protectedRoute, getUser);
router.put('/', protectedRoute, updateUser);
router.delete('/', protectedRoute, deleteUser);

export { router as userRouter };