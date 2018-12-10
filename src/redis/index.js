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
			    console.log('Redis client connected to:'.green, `${ process.env.REDIS_HOST }:${ process.env.REDIS_PORT }`);
			});

			this._connection.on('error', err => {
		 		if (process.env.MODE === 'development'){
		 			console.log(colors.red('Redis connection error:'.red, err.message));
		 		}
			});
		}	
	}
};

export default new Redis();