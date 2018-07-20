import { check } from 'express-validator/check';


const registerValidator = () => ([
		check('username')
			.not().isEmpty().withMessage('Usermame is required'),
		check('email')
			.isEmail().withMessage('Username must be an email')
			.not().isEmpty().withMessage('Email is required'),
		check('password')
			.not().isEmpty().withMessage('Password is required')
			.isLength({ min: 6 }).withMessage('must be at least 6 chars long')
			.matches(/\d/).withMessage('must contain a number')
	]);

const loginValidator = () => ([
		check('username')
			.not().isEmpty().withMessage('Usermame is required'),
		check('password')
			.not().isEmpty().withMessage('Password is required')
			.isLength({ min: 6 }).withMessage('must be at least 6 chars long')
			.matches(/\d/).withMessage('must contain a number')
	]);

export { registerValidator, loginValidator };