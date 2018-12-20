import nodemailer from 'nodemailer';
import Events from '@events';

const transporter = nodemailer.createTransport({
	// host: 'smtp.gmail.com',
    // port: 465,
    // secure: true, // use SSL
	service: process.env.MAILER,
	auth: {
		user: process.env.MAILER_ACCOUNT,
		pass: process.env.MAILER_PASSWORD
	}
});

var mailOptions = {
  from: process.env.MAILER_ACCOUNT,
  to: 'kostyshyn.a.work@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

const send = function(){
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log('Send error', error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
}

export { send }
