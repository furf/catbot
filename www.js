var five = require('johnny-five'),
    board = new five.Board();

board.on('ready', function() {

  var express = require('express'),
      http = require('http'),
      stylus = require('stylus'),
      socketio = require('socket.io'),

      PORT = 3000,
      PUBLIC_DIRECTORY = __dirname + '/public',
      VIEW_DIRECTORY = __dirname + '/views',
      COOKIE_SECRET = 'PygO5J9BDu146q5xKW4gP48L0QNaisF6toNoRmaV',

      app = express(),
      server = http.createServer(app),
      io = socketio.listen(server),
      
      servo1 = new five.Servo(9),
      servo2 = new five.Servo(10),
      led = new five.Led(13);


  // Config app
  app.configure(function () {
    app.set('views', VIEW_DIRECTORY);
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser(COOKIE_SECRET));
    app.use(express.session());
    app.use(app.router);
    app.use(stylus.middleware(PUBLIC_DIRECTORY));
    app.use(express['static'](PUBLIC_DIRECTORY));
  });

  app.configure('development', function () {
    app.use(express.errorHandler());
  });

  app.get('/', function (req, res, end) {
    res.render('index');
  });


  // Config Arduino
  board.repl.inject({
    servo1: servo1,
    servo2: servo2
  });


  // Config sockets
  io.sockets.on('connection', function (socket) {

    // Reset servos
    servo1.center();
    servo2.center();

    // Move
    socket.on('move', function (horizontal, vertical) {
      console.log('move', horizontal, vertical);
      servo1.move(horizontal * 150 + 15);
      servo2.move(vertical * 80 + 40);
    });

    // Fire!
    socket.on('light', function (enabled) {
      console.log('light', enabled);
      led[enabled ? 'on' : 'off']();
    });
  });

  // HTTP server
  server.listen(PORT, function () {
    console.log('Listening at http://localhost:' + PORT);
  });

});
