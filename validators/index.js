import { check } from 'express-validator/check';


const registerValidator = () => ([
		check('username')
			.not().isEmpty().withMessage('Usermame is required'),
		check('email')
			.not().isEmpty().withMessage('Email is required')
			.isEmail().withMessage('Invalid value'),
		check('password')
			.not().isEmpty().withMessage('Password is required')
			.isLength({ min: 6 }).withMessage('Must be at least 6 chars long')
			.matches(/\d/).withMessage('Must contain a number')
	]);

const loginValidator = () => ([
		check('username')
			.not().isEmpty().withMessage('Usermame is required'),
		check('password')
			.not().isEmpty().withMessage('Password is required')
			.isLength({ min: 6 }).withMessage('Must be at least 6 chars long')
	]);

export { registerValidator, loginValidator };