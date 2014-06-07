
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



// playful Main
var Qipan = require("./model/qipan.js");
var pan = new Qipan();

/*
pan.play(1,1);
pan.play(1,0);
pan.play(2,1);
pan.play(0,1);
pan.play(1,7);
pan.play(1,1);
pan.play(1,2);

pan.play(2,7);
pan.play(2,2);
pan.play(3,7);
pan.play(3,1);
pan.play(4,7);
pan.play(2,0);
*/



io.sockets.on('connection', function (socket) {
    socket.emit('connected',{rectnum: pan.rectnum});
    //socket.emit('update',pan.map);
    socket.on('my other event', function (data) {
        console.log(data);
    });
    socket.on('play',function(data){
        pan.play(data.x,data.y);
        socket.emit('update',pan.map);
    });
});

