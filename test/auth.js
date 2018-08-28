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

chai.use(chaiHttp);


import { User } from '../models/User';

describe('Auth tests', (done) => {

 	describe('Register', (done) => {
 
 	    it('Should register a user', (done) => {
 			const user = {
 				username: faker.name.findName(),
 				email: faker.internet.email(),
 				password: faker.internet.password()
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
				username: faker.name.findName(),
				email: faker.internet.email(),
				password: faker.internet.password()
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

			        chai.request('http://localhost:8889/api')
			            .get('/users/protected')
			            .set('x-access-token', token)
			            .end((err, res) => {
			                res.should.have.status(200);
			                res.body.should.be.a('object');
			                res.body.should.have.property('title');
			                res.body.title.should.be.a('string').eql('Hello from protected route!');
			                done();
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