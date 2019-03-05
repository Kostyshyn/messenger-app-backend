import nodemailer from 'nodemailer';
import Events from '@events';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const transporter = nodemailer.createTransport({
	service: process.env.MAILER,
	auth: {
		user: process.env.MAILER_ACCOUNT,
		pass: process.env.MAILER_PASSWORD
	}
});

const sendConfirmation =  function(user){
	return new Promise((resolve, reject) => {

		ejs.renderFile(path.resolve(__dirname, '../views/mails/verification.ejs'), {
			username: user.username,
			token: 'http://192.168.0.113:8889/account/confirmation?token=' + user.verification_token
		}, (err, data) => {
			if (err){
				reject(err);
			} else {

				const mailOptions = {
				  	from: process.env.MAILER_ACCOUNT,
				  	to: user.email,
				  	subject: 'Confirmation',
				  	html: data
				};

				transporter.sendMail(mailOptions, function(err, info){
				  	if (err) {
				    	reject(err);
				  	} else {
				    	resolve(info.response);
				  	}
				});				
			}
		});		
	});
};

export { sendConfirmation }
