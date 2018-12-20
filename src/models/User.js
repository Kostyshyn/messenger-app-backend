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
	reset_token: {
		type: String
	},
	verification_token: {
		type: String
	},
	profile_img: {
		type: String,
		default: 'public_images/128_profile_placeholder.png'
	},
	verified: {
		type: Boolean,
		default: false		
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


