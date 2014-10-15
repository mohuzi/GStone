
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);


var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



// It is a Main!
var Qipan = require("./model/qipan.js");
var pan = new Qipan();

// Socket handler
io.sockets.on('connection', function (socket) {
    socket.emit('connected',{rectnum: pan.rectnum});
    socket.emit('update',pan.map);

    // io event listener binding
    socket.on('play',function(data){
        pan.play(data.x,data.y);
        io.emit('update',pan.map);
    });
});


io.sockets.on('disconnect', function(socket){
    console.log('disconnect');
});
