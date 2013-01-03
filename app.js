
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , mongoose = require('mongoose')
  , querystring = require('querystring')
  , path = require('path');

var app = express()
  , server = http.createServer(app);

/**
 * Connection to database.
 */

mongoose.connect('mongodb://localhost');

var db = mongoose.connection;
routes.mydb = {};
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log('connected to db');
	routes.mydb.userSchema = mongoose.Schema({
		userName : String,
		password : String
	});
	routes.mydb.userModel = mongoose.model('userModel', routes.mydb.userSchema);
	routes.mydb.admin = new routes.mydb.userModel({userName : 'admin', password : 'admin'});
	var aaa = routes.mydb.userModel.find({ userName: 'admin' }, function(err, users){
		if (err) console.log(err);
		if (!users.length) {
			console.log('nope');
			routes.mydb.admin.save(function(err){
				console.log(err);
			});
		} else {
			console.log('yeahp!');
		}
	});
});

/**
 * Configurations.
 */

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.cookieSession({secret: 'mow'}));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/', routes.postLogin);
app.get('/registration', routes.registration);
app.post('/registration', routes.registrationPost);

		console.log('aaaaaaaaaaaaaa' + querystring.escape);
/*
 * SOCKET
 */
	var io = require('socket.io').listen(server),
		hF = {
			escapeHtml : function (str) {
				var arr = str.split('<');
				return arr.join('&lt;');
			},
			each : function (arr, event, obj) {
				var i = 0;
				for (i = 0; i < arr.length; i += 1) {
					arr[i].emit(event, obj);
				}
			}
		};
		socketsArr = [];

	io.sockets.on('connection', function(socket){
		// add a new socket connection to sockets Array
		socketsArr.push(socket);
		hF.each(socketsArr, 'youAreConnected', { 'dudes' : socketsArr.length});
		socket.on('outcomingMessage', function(data) {
			hF.each(socketsArr, 'incomingMessage', { user : hF.escapeHtml(data.user), message : hF.escapeHtml(data.message)});
		});
		socket.on('disconnect', function() {
			var i = socketsArr.indexOf(socket);
			socketsArr.splice(i, 1);
			hF.each(socketsArr, 'youAreConnected', { 'dudes' : socketsArr.length});
		});
	});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
