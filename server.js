// CREATE SERVER
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// SETUP BODY PARSER (JSON)
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// SET UP SPLASH PAGE
app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
  	// Send HTML headers and message
	res.sendFile(__dirname + '/index.html');
});

// SETUP SOCKET
var numUsers = 0;
var curUsers = 0;

io.sockets.on('connection', function (socket) {

	++numUsers;
	++curUsers;
	var usernr = numUsers;
	var username = 'client #'+usernr;
	
	console.log(username+' has connected');

	socket.on('disconnect',function(){
		--curUsers;
		console.log(username+' disconnected. Clients connected: '+curUsers);
	});
  
});

// CREATE POST SERVER FOR PHP
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