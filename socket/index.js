module.exports = function(io, handler){

	io.on('connection', function(socket){
  		console.log('a user connected');	
	});

};