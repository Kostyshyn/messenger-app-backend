import redis from 'redis';

class Redis {
	constructor(){
		this._connection = null;
	}

	connect(url, cb){
		if (!this._connection){
			this._connection = redis.createClient();

			this._connection.on('connect', () => {
			    console.log('Redis client connected');
			});

			this._connection.on('error', err => {
			    console.log('Something went wrong ' + err);
			});
		}	
	}
};

export default new Redis();