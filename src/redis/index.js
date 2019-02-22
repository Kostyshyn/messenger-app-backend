import redis from 'redis';
import colors from 'colors';

class Redis {
	constructor(){
		this._connection = null;
	}

	connect(url, cb){
		if (!this._connection){
			this._connection = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

			this._connection.on('connect', () => {
			    console.log('Redis client connected to:'.green, 
			    	`${ process.env.REDIS_HOST }:${ process.env.REDIS_PORT }`,
			    	'--- process: ' + process.pid);
			    	this.test();
			});

			this._connection.on('error', err => {
		 		if (process.env.NODE_ENV === 'development'){
		 			console.log(colors.red('Redis connection error:'.red, err.message));
		 		}
			});
		}	
	}

	test(){
		// const sockets = [1231234, 2342134, 2354235, 4564576];
		// this._connection.sadd.apply(this._connection, ['myset'].concat(sockets));
		// this._connection.get('myset', set => {
		// 	console.log(set)
		// });
	}
};

export default new Redis();