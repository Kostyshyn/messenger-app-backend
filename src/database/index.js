import mongoose from 'mongoose';
import colors from 'colors';
import empty from 'empty-folder';
import { User } from '../models/User';
mongoose.Promise = Promise;

class DataBase {
	constructor(){
		this._connection = null;
		// this._connect();
	}

	connect(url, cb){
		if (!this._connection){
			const self = this;
			mongoose.connect(process.env.DB_HOST + url).then(res => {
				self._connection = res.connection;
				self.drop(() => {
					if (process.env.MODE !== 'test'){
						self.seed();
						console.log('DataBase successfully connected to:'.green, process.env.DB_DATABASE);	
					}
					if (typeof cb == 'function'){
						cb();
					}
				});
			}).catch(err => {
		 		if (process.env.MODE === 'development'){
		 			console.log(colors.red('DataBase connection error:', err.message));
		 		}
			});
		}
	}

	drop(cb){
		if (this._connection && process.env.MODE !== 'production'){
			this._connection.db.dropDatabase(() => {
				empty('./storage', false, (err) => {
					if (typeof cb == 'function'){
						cb();
					}
				});
			});
		}
	}

	seed(cb){
		if (this._connection && process.env.MODE !== 'production'){
			const seeds = [
				new User({
					username: 'admin',
					email: 'admin@admin.com',
					password: 'admin_admin',
					role: process.env.PRIVATE_ACCESS_ADMIN
				}),
				new User({
					username: 'root',
					email: 'root@root.com',
					password: 'root_root'					
				})
			];

			let done = 0;

			for (let i = 0; i < seeds.length; i++){
				seeds[i].save((err) => {
					done++;
					if (done == seeds.length && typeof cb == 'function'){
						cb();
					}
				});
			}
		}
	}

};

export default new DataBase();