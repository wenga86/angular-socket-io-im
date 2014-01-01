/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var socket = require('./routes/socket');
var http = require('http');
var path = require('path');

var app = express();
var http = require('http');
var server = http.createServer(app);

// Hook Socket.io into Express
var io = require('socket.io').listen(server);

// All environments
app.set('port', process.env.PORT || 3000);

// Set view path
app.set('views', path.join(__dirname, 'views'));

// Set view engine to JADE. Very similar to HAML
app.set('view engine', 'jade');

// Set Favicon
app.use(express.favicon());

// Set logger for development
app.use(express.logger('dev'));

// Include JSON support
app.use(express.json());

// Include support to parse routes
app.use(express.urlencoded());

// Include methodOverride to allow for put and delete requests
app.use(express.methodOverride());

// Setup app router
app.use(app.router);

// Setup root path to static files for app
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// Development specific
if ('development' == app.get('env')) {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

// Production Specific
if ('production' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// Perhaps in the wrong place since this piece of code overrides any attempts to
// find a static file.
// redirect all others to the index (HTML5 history)
// app.get('*', routes.index);

// Socket.io Communication
io.sockets.on('connection', socket);

// Start Server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
