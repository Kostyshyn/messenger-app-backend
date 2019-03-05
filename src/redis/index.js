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

			    // setTimeout(() => {
			    // 	this.test();
			    // }, 1000);
			});

			this._connection.on('error', err => {
		 		if (process.env.NODE_ENV === 'development'){
		 			console.log(colors.red('Redis connection error:'.red, err.message));
		 		}
			});
		}	
	}

	test(){

		const clients = {
			'test_client1': ['test1', 'test2'],
			'test_client2': ['test1', 'test2', 'test3']
		};

		this._connection.hmset('clients', clients);

		this._connection.hgetall('clients', function(err, object) {
		    console.log(object);
		});

	}
};

export default new Redis();