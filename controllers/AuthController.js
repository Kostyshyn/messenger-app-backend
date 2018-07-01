var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/User');
var CONFIG = require('../config/');
var helper = require('../helpers/');

module.exports = {
	register(req, res, next){
		User.findOne({
			$or: [
				{ 'username': req.body.username }, 
				{ 'email': req.body.email }
			]
		}, (err, user) => {
			if (err){
				next(err);
			} else if (user){
				var errors = [];
				if (user.username == req.body.username && user.email == req.body.email){
					errors.push({
						field: 'username',
						message: `User with username ${ req.body.username } is already exists`
					});
					errors.push({
						field: 'email',
						message: `User with email ${ req.body.email } is already exists`
					});
				} else if (user.username == req.body.username){
					errors.push({
						field: 'username',
						message: `User with username ${ req.body.username } is already exists`
					});
				} else if (user.email == req.body.email){
					errors.push({
						field: 'email',
						message: `User with email ${ req.body.email } is already exists`
					});
				};
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
					var token = helper.generateToken({ id: user._id });
					res.status(201);
					res.json({
						status: 201,
						success: true, 
						user: {
							username: user.username,
							href: user.href,
							profile_img: user.profile_img,
							role: user.role,
							id: user._id
						},
						token: token
					});
				}).catch(err => {
					next(err);			
				});
			}
		});
	},
	login(req, res, next){
		var loginInput = {
			userInput: req.body.userInput,
			password: req.body.password
		};
		User.findOne({
			$or: [
				{ 'username': req.body.userInput }, 
				{ 'email': req.body.userInput }
			]
		}, function(err, user){
			if (err){
				next(err);
			} else if (!user){
				var errors = [];
				errors.push({
					field: 'userInput',
					message: 'user not found'
				});
				res.status(403);
				res.json({
					status: 403,
					success: false,
					errors: errors
				});
			} else if (!helper.isValidPassword(user, req.body.password)){
				var errors = [];
				errors.push({
					field: 'password',
					message: 'invalid password'
				});
				res.status(401);
				res.json({
					status: 401,
					success: false,
					errors: errors
				});
			} else {
				var token = helper.generateToken({ id: user._id });
				res.status(200);
				res.json({
					status: 200, 
					success: true,
					user: {
						username: user.username,
						href: user.href,
						profile_img: user.profile_img,
						role: user.role,
						id: user._id					
					},
					token: token
				});			
			}
		});
	}
};


