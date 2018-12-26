#!/usr/bin/env node

/**
 * Module dependencies.
 */

require('dotenv/config');

var moduleAlias = require('module-alias');
var path = require('path');

moduleAlias.addAliases({
  "@root": path.resolve(__dirname, "../"),
  "@controllers": path.resolve(__dirname, "../controllers"),
  "@validators": path.resolve(__dirname, "../validators"),
  "@models": path.resolve(__dirname, "../models"),
  "@routes": path.resolve(__dirname, "../routes"),
  "@helpers": path.resolve(__dirname, "../helpers"),
  "@database": path.resolve(__dirname, "../database"),
  "@redis": path.resolve(__dirname, "../redis"),
  "@events": path.resolve(__dirname, "../events"),
  "@mailer": path.resolve(__dirname, "../mailer"),
  "@views": path.resolve(__dirname, "../views")
});

var app = require('../app');
var debug = require('debug')('messenger-app-backend:server');
var http = require('http');
var socketIo = require('socket.io');
var colors = require('colors');
var os = require('os');
var ip = require('ip');
var helper = require('../helpers/');
var cluster =  require('cluster');

helper.checkDir('../storage');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || 8080);
app.set('port', port);

/**
 * Create HTTP server.
 */

if (process.env.MODE === 'development'){
  var server = http.createServer(app);
  var io = socketIo.listen(server);
  require('../socket')(io, null);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port, function(){
    console.log('Server listenning on:'.green, ip.address() + ':' + port, '--- process: ' + process.pid);
  });
  server.on('error', onError);
  server.on('listening', onListening);  
} else {
  if (cluster.isMaster) {
    var cpuCount = os.cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
      cluster.fork();
    }
  } else {
    var server = http.createServer(app);
    var io = socketIo.listen(server);
    require('../socket')(io, null);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port, function(){
      console.log('Server listenning on:'.green, ip.address() + ':' + port, '--- process: ' + process.pid);
    });
    server.on('error', onError);
    server.on('listening', onListening);
  }
}



/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

