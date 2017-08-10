// CREATE BROADCAST SERVER
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var numUsers = 0;

io.sockets.on('connection', function (socket) {

	++numUsers;
	var usernr = numUsers;
	
	console.log('user #'+usernr+' has connected');
	socket.on('disconnect',function() {
		console.log(usernr+' disconnected');
		--numUsers;
	});
  
});

// CREATE POST SERVER FOR PHP
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/live',function(req,res){
  console.log('Live updated');
  io.emit('refresh', 'live');
  res.end("1");
});

app.post('/shout',function(req,res){
  console.log('Shout updated');
  io.emit('refresh', 'shout');
  res.end("1");
});

http.listen(3000);
console.log('Server running at port 3000');