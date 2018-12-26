import jwt from 'jsonwebtoken';
import { User } from '@models/User';

const confirmation = function(req, res, next){
	const token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, process.env.SECRET_CONFIRMATION_KEY, (err, decoded) => {      
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
				console.log(decoded.email);

				User.findOne({
					email: decoded.email
				}).then(user => {
					if (user && user.verified == false){
						user.verified = true;
						user.save().then(user => {
							res.render('auth-pages/confirmation');
						}).catch(err => {
							next(err);
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

export { confirmation };