import { User } from '@models/User';

const getUser = function(req, res, next){

	User.findOne({
		href: req.params.href
	}).then(user => {
		if (user){
			res.status(200);
			res.json({
				status: 200,
				success: true, 
				user: {
				 	username: user.username,
				 	href: user.href,
				 	profile_img: user.profile_img,
				 	role: user.role,
				 	followers: user.followers,
				 	follows: user.follows,
				 	private: user.private,
				 	id: user._id
				}
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

const updateUser = function(req, res, next){
	User.findById(req.decoded.id).then(user => {
		if (user){

			const whiteList = ['username', 'email', 'password', 'private', 'profile_img'];
			const updated = {};

			for (let i = 0; i < whiteList.length; i++){
				if (req.body[whiteList[i]]){
					updated[whiteList[i]] = req.body[whiteList[i]];
				}
			};

			user.set(updated);
			user.save().then(user => {
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
						private: user.private,
						id: user._id,
						updated: user.updatedAt,
						created: user.createdAt	
					}
				});
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
};

const deleteUser = function(req, res, next){
	User.findById(req.decoded.id).then(user => {
		if (user){
			user.remove().then(user => {
				res.status(200);
				res.json({
					status: 200,
					success: true, 
					user: null
				});
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
};

export { getUser, updateUser, deleteUser };