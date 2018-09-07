import EventEmitter from 'events';

class Events extends EventEmitter {
	constructor(){
		super();
	}
};

export default new Events();