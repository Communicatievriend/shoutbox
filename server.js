// CREATE SERVER
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// SETUP BODY PARSER (JSON)
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// SET UP SPLASH PAGE
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
	
	console.log(username+' has connected. Clients connected: '+curUsers);

	socket.on('disconnect',function(){
		--curUsers;
		console.log(username+' disconnected. Clients connected: '+curUsers);
	});
  
});

// CREATE POST SERVER
app.post('/refresh',function(req,res) {

  var this_pwd = req.body.password;
  if(this_pwd == '6SHd5KR7jSFrpruM')
  {
  	delete req.body.password;
  	var letype = req.body.type;
  	
  	if(typeof letype !== 'undefined' && letype != 0)
	{
  		io.emit('refresh', letype);
  		console.log('Sending refresh to all clients: '+letype);
  		res.end("1");
  	}
  }
  
});

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

http.listen(process.env.PORT, function(){
  console.log('Server started on *:'+process.env.PORT);
});