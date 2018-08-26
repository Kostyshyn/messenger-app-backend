require('dotenv/config');

process.env.MODE = 'test';

const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();
const request = require('request');
const mongoose = require('mongoose');

import { User } from '../models/User';

describe('Auth tests', (done) => {
    it('Protected route should return 403 status code if no token', (done) => {
	    request('http://localhost:8889/api/users/protected' , (err, res, body) => {
	        expect(res.statusCode).to.equal(403);
	        done();
	    });
    });
    it('Shouldn\'t register a user (email validation error)', (done) => {
    	const user = {
    		username: 'Kos',
    		email: '',
    		password: '123456'
    	};
		request({
			method: 'POST',
		  	headers: { 'Content-Type': 'application/json' },
		  	url: 'http://localhost:8889/api/register',
		  	json: user
		}, (err, res, body) => {
	        expect(res.statusCode).to.equal(403);
	        expect(res.body.success).to.equal(false);
	        expect(res.body).to.have.property('errors');
	        expect(res.body.errors[0].msg).to.equal('Email is required');
	        done();
		});
    });
    it('Shouldn\'t register a user (password validation error)', (done) => {
    	const user = {
    		username: 'Kos',
    		email: 'ko@sdfa.safd',
    		password: ''
    	};
		request({
			method: 'POST',
		  	headers: { 'Content-Type': 'application/json' },
		  	url: 'http://localhost:8889/api/register',
		  	json: user
		}, (err, res, body) => {
	        expect(res.statusCode).to.equal(403);
	        expect(res.body.success).to.equal(false);
	        expect(res.body).to.have.property('errors');
	        expect(res.body.errors[0].msg).to.equal('Password is required');
	        done();
		});
    });
});