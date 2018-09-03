require('dotenv/config');
require('module-alias/register');

process.env.MODE = 'test';

const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();
const request = require('request');
const mongoose = require('mongoose');
const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const async = require('async');
// const faker = require('faker');

chai.use(chaiHttp);

// import { User } from '../models/User';
import database from '../database';

describe('Test', (done) => {

	before(done => {
		database.connect(process.env.DB_URL, done);
	});

	beforeEach(done => {
		database.drop(done);
	});

	afterEach(done => {
		database.drop(done);
	});

	after(done => {
		database.seed(done);
	});

 	describe('Register', (done) => {
 
 	    it('Should register a user', (done) => {
 			const user = {
 				username: 'test',
 				email: 'test@test.com',
 				password: '123456'
 			};
 	        chai.request('http://localhost:8889/api')
 	            .post('/register')
 	            .send(user)
 	            .end((err, res) => {
 	                res.should.have.status(201);
 	                res.body.should.be.a('object');
 	                res.body.should.have.property('token');
 	                res.body.should.have.property('user');
 	                res.body.user.should.be.a('object');
 	                res.body.user.should.have.property('username');
 	                res.body.user.should.have.property('href');
 	                res.body.user.should.have.property('profile_img');
 	                res.body.user.should.have.property('role');
 	                res.body.user.should.have.property('id');
 	              	done();
 	            });
 	    });
 
 	    it('Should not register a user, return errors', (done) => {
 	        chai.request('http://localhost:8889/api')
 	            .post('/register')
 	            .send({})
 	            .end((err, res) => {
 	                res.should.have.status(403);
 	                res.body.should.be.a('object');
 	                res.body.should.have.property('errors');
 	                res.body.errors.should.be.a('array');
 	              	done();
 	            });
 	    });
 
 
 	});

	describe('Login', (done) => {

	    it('Should login a user', (done) => {

	    	const userSchema = {
 				username: 'test',
 				email: 'test@test.com',
 				password: '123456'
			};

	    	async.waterfall([

	    		(next) => {
			        chai.request('http://localhost:8889/api')
			            .post('/register')
			            .send(userSchema)
			            .end((err, res) => {
			                res.should.have.status(201);
			                res.body.should.be.a('object');
			                res.body.should.have.property('token');
			                res.body.should.have.property('user');
			                res.body.user.should.be.a('object');
			                res.body.user.should.have.property('username');
			                res.body.user.should.have.property('href');
			                res.body.user.should.have.property('profile_img');
			                res.body.user.should.have.property('role');
			                res.body.user.should.have.property('id');
			                next(null, res.body.user);
			            });
	    		},
	    		(user, next) => {

			        chai.request('http://localhost:8889/api')
			            .post('/login')
			            .send({ username: userSchema.email, password: userSchema.password })
			            .end((err, res) => {
			                res.should.have.status(200);
			                res.body.should.be.a('object');
			                res.body.should.have.property('token');
			                res.body.should.have.property('user');
			                res.body.user.should.be.a('object');
			                res.body.user.should.have.property('username');
			                res.body.user.should.have.property('href');
			                res.body.user.should.have.property('profile_img');
			                res.body.user.should.have.property('role');
			                res.body.user.should.have.property('id');
			                next(null, res.body.token);
			            });
	    		},
	    		(token, next) => {

			        // chai.request('http://localhost:8889/api')
			        //     .get('/users/protected')
			        //     .set('x-access-token', token)
			        //     .end((err, res) => {
			        //         res.should.have.status(200);
			        //         res.body.should.be.a('object');
			        //         res.body.should.have.property('title');
			        //         res.body.title.should.be.a('string').eql('Hello from protected route!');
			        //         done();
			        //     });
			        next();
	    		}

	    		], (err, result) => {
	    			done();
	    		});

	    });

	    it('Should not login a user, return errors', (done) => {
	        chai.request('http://localhost:8889/api')
	            .post('/login')
	            .send({})
	            .end((err, res) => {
	                res.should.have.status(403);
	                res.body.should.be.a('object');
	                res.body.should.have.property('errors');
	                res.body.errors.should.be.a('array');
	              	done();
	            });
	    });


	});

// 	describe('Protected routes', (done) => {
// 
// 	    it('Should return an error if token is invalid', (done) => {
// 	        chai.request('http://localhost:8889/api')
// 	            .get('/users/protected')
// 	            .set('x-access-token', 'invalid token')
// 	            .end((err, res) => {
// 	                res.should.have.status(403);
// 	                res.body.should.be.a('object');
// 	                res.body.should.have.property('errors');
// 	                res.body.errors.should.be.a('array');
// 	                res.body.errors[0].should.be.a('object');
// 	                res.body.errors[0].should.have.property('msg');
// 	                res.body.errors[0].msg.should.be.a('string').eql('token verification failed');
// 	              	done();
// 	            });
// 	    });
// 
// 	     it('Should return an error if no token', (done) => {
// 	         chai.request('http://localhost:8889/api')
// 	             .get('/users/protected')
// 	             .end((err, res) => {
// 	                 res.should.have.status(401);
// 	                 res.body.should.be.a('object');
// 	                 res.body.should.have.property('errors');
// 	                 res.body.errors.should.be.a('array');
// 	                 res.body.errors[0].should.be.a('object');
// 	                 res.body.errors[0].should.have.property('msg');
// 	                 res.body.errors[0].msg.should.be.a('string').eql('no token');
// 	               	done();
// 	             });
// 	     });
// 
// 	});

	describe('User update', (done) => {

	    it('Should update a user', (done) => {

	    	const userSchema = {
 				username: 'test',
 				email: 'test@test.com',
 				password: '123456'
			};

	    	async.waterfall([

	    		(next) => {
			        chai.request('http://localhost:8889/api')
			            .post('/register')
			            .send(userSchema)
			            .end((err, res) => {
			                res.should.have.status(201);
			                res.body.should.be.a('object');
			                res.body.should.have.property('token');
			                res.body.should.have.property('user');
			                res.body.user.should.be.a('object');
			                res.body.user.should.have.property('username');
			                res.body.user.should.have.property('href');
			                res.body.user.should.have.property('profile_img');
			                res.body.user.should.have.property('role');
			                res.body.user.should.have.property('id');
			                next(null, res.body.token);
			            });
	    		},
	    		(token, next) => {

			        chai.request('http://localhost:8889/api')
			            .put('/users')
			            .set('x-access-token', token)
			            .send({ username: 'new username', password: 'new_password' })
			            .end((err, res) => {
			                res.should.have.status(200);
			                res.body.should.be.a('object');
			                res.body.should.have.property('user');
			                res.body.user.should.be.a('object');
			                res.body.user.should.have.property('username');
			                res.body.user.username.should.be.a('string').eql('new username');
			                res.body.user.should.have.property('href');
			                res.body.user.href.should.be.a('string').eql('new-username');
			                res.body.user.should.have.property('profile_img');
			                res.body.user.should.have.property('role');
			                res.body.user.should.have.property('id');
			                next(null, res.body.user);
			            });
	    		},
	    		(user, next) => {

			        chai.request('http://localhost:8889/api')
			            .post('/login')
			            .send({ username: 'new username', password: 'new_password' })
			            .end((err, res) => {
			                res.should.have.status(200);
			                res.body.should.be.a('object');
			                res.body.should.have.property('token');
			                res.body.should.have.property('user');
			                res.body.user.should.be.a('object');
			                res.body.user.should.have.property('username');
			                res.body.user.should.have.property('href');
			                res.body.user.should.have.property('profile_img');
			                res.body.user.should.have.property('role');
			                res.body.user.should.have.property('id');
			                next(null, res.body.token);
			            });
	    		}

	    		], (err, result) => {
	    			done();
	    		});

	    });

	    it('Should not login a user, return errors', (done) => {
	        chai.request('http://localhost:8889/api')
	            .post('/login')
	            .send({})
	            .end((err, res) => {
	                res.should.have.status(403);
	                res.body.should.be.a('object');
	                res.body.should.have.property('errors');
	                res.body.errors.should.be.a('array');
	              	done();
	            });
	    });


	});


});
