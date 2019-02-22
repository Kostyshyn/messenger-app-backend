import socketioJwt from 'socketio-jwt';

const socketConnection =  function(io, handler){
// 
// 	io.on('connection', socket => {
//   		console.log('a user connected');	
// 	});

 	io.sockets.on('connection', socketioJwt.authorize({
 	    secret: process.env.SECRET_AUTH_KEY,
 	    timeout: 1000 // 15 seconds to send the authentication message 
 	})).on('authenticated', socket => {
 		console.log('a user connected', socket.decoded_token.id, socket.id);
 		socket.join(socket.decoded_token.id);
 		console.log('conn', io.sockets.adapter.rooms)
 		console.log('---------', Object.keys(io.sockets.adapter.rooms).length)

		socket.on('disconnect', () => {  
	    	console.log('a user disconnected', socket.decoded_token.id, socket.id);
	    	socket.leave(socket.decoded_token.id);
	    	console.log('dis', io.sockets.adapter.rooms)
	    	console.log('---------', Object.keys(io.sockets.adapter.rooms).length)
	    });

 	});

};

export { socketConnection };