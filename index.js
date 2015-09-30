var express = require('express');
var mongoose = require('mongoose');
var serveStatic = require('serve-static');
var app = express();
var server = require('http').Server(app);
server.listen(80);
console.log("Server Opened At Port 80");
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));


var cookieParser = require('cookie-parser');
var cookie = require('cookie');
app.use(cookieParser());

var session = require('express-session');
var sessionStore = require('sessionstore');
store = sessionStore.createSessionStore();

app.use(session({
  store: store,
  secret: 'grooshbene',
  cookie: {
    path: '/',
    expires: false
  }
}));



app.use(serveStatic(__dirname));


var data_base = mongoose.connection;
var chk = false;
var id;
var pw;
mongoose.connect("mongodb://localhost:27017/db", function(err) {
  if (err) {
    console.log("Mongoose DB ERROR!");
    throw (err);
  }
});
var schema = mongoose.Schema;
var loginSchema = new schema({
  user_id: {
    type: String
  },
  user_pw: {
    type: String
  },
  user_name: {
    type: String
  }
});
var user = mongoose.model('user', loginSchema);

io.on('connection', function(socket) {
  socket.emit('session', {
    user_id: "Welcome!"
  });
});

app.get("/", function(req, res) {
  res.sendfile("index.html");
});

app.post("/login", function(req, res) {
  user.findOne({
    'user_id': req.body.id
  }, function(err, a) {
    if (err) {
      console.err(err);
      throw (err);
    }
    if (a == null) {
      res.send("User NULLPtr");
    } else {
      console.log(a);
      req.session.user_id = a.user_name;
      io.on('connection', function(socket) {
        if (req.session.user_id != null) {
          socket.emit('session', {
            user_id: "User " + req.session.user_id + " LogIn!"
          });
        }
      });
      res.send("Welcome, User " + a.user_id + "<br/>" + "Name : " + a.user_name +
        "<br/>" + "UserId : " + a
        .user_id + "<br/>" + "UserPw : " + a.user_pw);
    }
  })
});

app.get("/findid", function(req, res) {
  res.sendfile("findid.html");
  console.log(req.body);
});

app.get("/delete", function(req, res) {
  res.sendfile("delete.html");
  console.log(req.body);
});

app.get("/create", function(req, res) {
  res.sendfile("signin.html");
  console.log(req.body);
});

app.post("/findidconfirm", function(req, res) {
  var memos = new user();
  user.findOne({
    'user_name': req.body.name
  }, function(err, a) {

    if (err) {

      console.err(err);

      throw err;

    }

    if (a == null) {
      res.send("Nothing Here~");
    } else {

      console.log(a);

      res.send("Your ID And Password Is " + a.user_id + "," + a.user_pw);

    }
  });
});

app.post("/deleteconfirm", function(req, res) {
  // user.find({
  //   user_id: req.body.id
  // }).remove().exec();
  user.findOne({
    'user_id': req.body.id
  }, function(err, a) {
    if (err) {
      console.err(err);
      throw err;
    }
    if (a == null) {
      res.send("Unknowned Schema!");
    } else {
      console.log(a);
      user.find({
        user_id: req.body.id
      }).remove().exec();
      res.send("Data Deleted!");
    }
  })
});

app.post("/logout", function(req, res) {

  console.log(req.session.user_id);
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
      throw (err);
    }
    res.send("Logout Successfully!");
  });
  io.on('connection', function(socket) {
    socket.emit('session', {
      user_id: "Welcome!"
    });
  });

});

app.post("/signinconfirm", function(req, res) {
  var a = new user();
  a.user_id = req.body.id;
  a.user_pw = req.body.pw;
  a.user_name = req.body.name;
  if (a.user_pw.length < 8) {
    res.send("Pw must be over 8 lengths");
  } else {
    a.save(function(err, silence) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.send("Success");
    });
  }
});
app.get("/users", function(req, res, err) {
  var memos = new user();
  user.find().exec(function(err, a) {
    if (err) {
      console.err(err);
      throw err;
    }
    res.send(a.join('<br/>'));

  });

});
