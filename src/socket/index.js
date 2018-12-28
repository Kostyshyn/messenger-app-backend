const socketConnection =  function(io, handler){

	io.on('connection', socket => {
  		console.log('a user connected');	
	});

};

export { socketConnection };