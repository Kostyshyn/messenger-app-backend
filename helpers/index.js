import fs from 'fs';
import colors from 'colors';
import CONFIG from '../config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
mongoose.Promise = Promise;


const checkDir = function(directory){  
	try {
		fs.statSync(directory);
	} catch(e) {
		fs.mkdirSync(directory);
		console.log('Storage is created'.green);
	}	
};

const connectDB = function(url){
	mongoose.connect(url);
	var db = mongoose.connection;

	db.on('error', function(err){
		console.log(colors.red('DataBase connection error:', err.message));
	});

	db.once('connected', function(){
		console.log('DataBase successfully connected to:'.green, CONFIG.DB_URL);
	});		
};

const isValidPassword = function(user, password){
	return bcrypt.compareSync(password, user.password);
};

const generateToken = function(payload){
	var token = jwt.sign(payload, CONFIG.PRIVATE.SECRET_AUTH_KEY, {
			expiresIn:  CONFIG.PRIVATE.EXPIRES_TOKEN // 86400 // 24 hours
		});
	return token;
};

// use for protected routes (need token)
	
const protectedRoute = function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, CONFIG.PRIVATE.SECRET_AUTH_KEY, (err, decoded) => {      
			if (err){
				res.status(401).json({
					status: 401,
					success: false, 
					message: 'token verification failed' 
				});    
			} else {
		       	// if everything is good, save to request for use in other routes
		       	// token payload saved in -> decoded
		       	req.decoded = decoded;    
		       	next();
		       }
		    });
	} else {
		res.status(403).json({
			status: 403,
			success: false, 
			message: 'no token' 
		});
	}
};

export { checkDir, connectDB, isValidPassword, generateToken, protectedRoute }
