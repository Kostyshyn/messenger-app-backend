import fs from 'fs';
import colors from 'colors';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';


const checkDir = function(directory){  
	try {
		fs.statSync(directory);
	} catch(e) {
		fs.mkdirSync(directory);
		console.log('Storage is created'.green);
	}	
};

const isValidPassword = function(user, password){
	return bcrypt.compareSync(password, user.password);
};

const generateToken = function(payload){
	var token = jwt.sign(payload, process.env.SECRET_AUTH_KEY, {
			expiresIn: parseInt(process.env.EXPIRES_TOKEN) // 86400 // 24 hours
		});
	return token;
};

// use for protected routes (need token)
	
const protectedRoute = function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, process.env.SECRET_AUTH_KEY, (err, decoded) => {      
			if (err){
				res.status(403).json({
					status: 403,
					success: false, 
					errors: [
						{
							msg: 'token verification failed',
							param: 'token',
							value: token
						}
					] 
				});    
			} else {
		       	// if everything is good, save to request for use in other routes
		       	// token payload saved in -> decoded
		       	req.decoded = decoded;    
		       	next();
		       }
		    });
	} else {
		res.status(401).json({
			status: 401,
			success: false, 
			errors: [
				{
					msg: 'no token',
					param: 'token',
					value: ''
				}
			] 
		});
	}
};

export { checkDir, isValidPassword, generateToken, protectedRoute }
