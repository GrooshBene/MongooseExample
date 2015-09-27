var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var chk = false;
var serveStatic = require('serve-static');
var mongoose = require('mongoose');
var data_base = mongoose.connection;
var id;
var pw;
mongoose.connect("mongodb://localhost:27017/db", function(err) {
  if (err) {
    console.log("Mongoose DB ERROR!");
    throw (err);
  }
  app.listen(80, function() {
    console.log("Server Working On Port 80");
  });
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

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(serveStatic(__dirname));

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
