const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
mongoose.Promise = Promise;

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
	role: {
		type: Number,
		default: process.env.PRIVATE_ACCESS_USER
	},
	username: {
		type: String,
		required: true,
		unique: true,
        min: [6, 'Too short password'],
        max: 12
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	info: {
		type: String,
		default: ''
	},
	profile_img: {
		type: String,
		default: 'public_images/128_profile_placeholder.png'
	},
	online: {
		type: Boolean,
		default: false
	},
	href: {
		type: String,
		unique: true,
		trim: true,
	},
	private: {
		type: Boolean,
		default: false	
	},
	// posts: [{
	// 	type: Schema.ObjectId,
	// 	ref: 'Post'
	// }],
	// likes: [{
	// 	type: Schema.ObjectId,
	// 	ref: 'Like'
	// }],
	// comments: [{
	// 	type: Schema.ObjectId,
	// 	ref: 'Comment'
	// }],
	followers: [{
		id: Schema.ObjectId
	}],
	follows: [{
		id: Schema.ObjectId
	}],
	last_seen: {
		type: Date,
		default: Date.now		
	}
}, {
  	timestamps: true
});

userSchema.pre('save', function(next){
	const user = this;

	if (user.isModified('password') || user.isModified('username')){

		const hash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
		user.password = hash;
		user.href = user.username.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}|=\-_`~()]/g,"").replace(/\s/g, '-');
		next(null, user);
		
	} 
	return next();
});


const User = mongoose.model('User', userSchema);

export { User }


