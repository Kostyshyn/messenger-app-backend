import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import { User } from '@models/User';
import { isValidPassword, generateToken } from '@helpers';
import { validationResult } from 'express-validator/check';
import { sendConfirmation } from '@mailer';

const register = function(req, res, next){
	const e = validationResult(req);
	if (!e.isEmpty()){
		return res.status(403).json({
					status: 403,
					success: false,
					errors: e.array()
				});
	}
	User.findOne({
		$or: [
		{ 'username': req.body.username }, 
		{ 'email': req.body.email }
		]
	}, (err, user) => {
		if (err){
			next(err);
		} else if (user){
			const errors = [];
			if (user.username === req.body.username){
				errors.push({
					location: 'body',
					param: 'username',
					value: req.body.username,
					msg: 'A user with this username already exists'
				});
			} else {
				errors.push({
					location: 'body',
					param: 'email',
					value: req.body.email,
					msg: 'A user with this email already exists'
				});
			}
			res.status(403);
			res.json({
				status: 403,
				success: false,
				errors: errors
			});
		} else {
			User.create({
				username: req.body.username,
				password: req.body.password,
				email: req.body.email
			}).then(user => {
				sendConfirmation(user).then(res => {

				}).catch(err => {
					next(err)
				});

				const token = generateToken({ id: user._id });
				res.status(201);
				res.json({
					status: 201,
					success: true, 
					user: {
						username: user.username,
						email: user.email,
						href: user.href,
						profile_img: user.profile_img,
						role: user.role,
						id: user._id,
						updated: user.updatedAt,
						created: user.createdAt	
					},
					token: token
				});
			}).catch(err => {
				next(err);			
			});
		}
	});
};

const login = function(req, res, next){
	const e = validationResult(req);
	if (!e.isEmpty()){
		return res.status(403).json({
					status: 403,
					success: false,
					errors: e.array()
				});
	}
	User.findOne({
		$or: [
		{ 'username': req.body.username }, 
		{ 'email': req.body.username }
		]
	}, function(err, user){
		if (err){
			next(err);
		} else if (!user){
			const errors = [];
			errors.push({
				location: 'body',
				param: 'username',
				value: req.body.username,
				msg: 'User with this name is not found'
			});
			res.status(403);
			res.json({
				status: 403,
				success: false,
				errors: errors
			});
		} else if (!isValidPassword(user, req.body.password)){
			const errors = [];
			errors.push({
				location: 'body',
				param: 'password',
				value: '',
				msg: 'Incorrect password'
			});
			res.status(403);
			res.json({
				status: 403,
				success: false,
				errors: errors
			});
		} else {
			const token = generateToken({ id: user._id });
			res.status(200);
			res.json({
				status: 200, 
				success: true,
				user: {
					username: user.username,
					email: user.email,
					href: user.href,
					profile_img: user.profile_img,
					role: user.role,
					id: user._id,
					updated: user.updatedAt,
					created: user.createdAt					
				},
				token: token
			});			
		}
	});
};

const forgotPassword = function(req, res, next){

};

const confirmation = function(req, res, next){
	User.findById(req.decoded.id).then(user => {
		if (user && user.verified == false){
			sendConfirmation(user).then(response => {
				res.status(200);
				res.json({
					status: 200,
					success: true, 
					msg: response
				});				
			}).catch(err => {
				next(err)
			});
		} else {
			res.status(404);
			res.json({
				status: 404,
				success: false, 
				user: null
			});	
		}
	}).catch(err => {
		next(err);
	});
};

export { register, login, confirmation };


