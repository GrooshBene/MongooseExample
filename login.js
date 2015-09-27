    var express = require('express');
    var serveStatic = require('serve-static');
    var app = express();
    var req_id; 
    var req_pwd;
    var id;
    var pwd;
    var pattern = /[~!@\#$%^&*\()\-=+_']/gi;
///////////////////
    var mongoose = require('mongoose');
    var data_base = mongoose.connection;
    mongoose.connect("mongodb://localhost/db");
    var Schema = mongoose.Schema;
    var loginSchema = new Schema({
      user_id:  {type : String},
      user_pw: {type : String},
      email:  {type : String},
      date: {type : Date}
    });
    var user = mongoose.model('user',loginSchema);
    //user.insert();
    var a = new user({
        user_id : id,
        user_pw : pwd
    });
    console.log(a); 
    a.save(function(err){
        if(err){
        throw err;    
        }
        console.log("성공");
    });
    user.find({id : ""},function(err,result){
        console.log(result);
    });
/////////////////////////////////
    /////
    app.use( require('body-parser').urlencoded({
        extended: false
    }) );

    app.use( serveStatic(__dirname) );
    app.get('/a',function(req,res){
        res.sendFile('/js_login.html', {
           root: __dirname 
        });
    });
    app.post('/register',function(req,res){
        req_id = req.body.id;
        req_pwd = req.body.pwd;
        console.log("Request Register ID : "+req_id);
        console.log("Request Register PWD : "+req_pwd);
        console.log("ID : "+id);
        console.log("PWD : "+pwd); 
          
        if(req_id == id){
        res.send("ERROR : 중복 아이디입니다.");
        }
        else if(req_id.length <= 5){
        res.send("ERROR : 6글자 이상 입력해야 합니다.");
        }
        //else if(pattern.test(req_id.value)){
        //res.send("ERROR : 특수 문자가 1개이상 필요 합니다.");
        //}
        else{
        id = req_id;
        pwd = req_pwd;
        res.send("SUCCESS : 환영합니다.");
        console.log("Register User | ID :"+id+" PWD : "+pwd);
        console.log(a);
            
        }
        });
    app.post('/login',function(req,res){
        req_id = req.body.id;
        req_pwd = req.body.pwd;
        console.log("Request Login ID : "+req_id);
        console.log("Request Login PWD : "+req_pwd);
        console.log("ID : "+id);
        console.log("PWD : "+pwd); 
        if(req_id != id){
            res.send("존재 하지 않는 아이디 입니다.");
        }
        else if(req_pwd != pwd){
            res.send("비밀번호가 잘못 되었습니다.");
        }
        else{
        id = req_id;
        pwd = req_pwd;
        res.send("환영합니다."+id+"님!");
        console.log("Login User | ID :"+id+" PWD : "+pwd);
        }
    });
    app.post('/findid',function(req,res){
        req_pwd = req.body.pwd;
        console.log("Request Find ID : "+req_pwd);
        console.log("ID : "+id);
        console.log("PWD : "+pwd); 
        if(req_pwd != pwd){
            res.send("비밀번호가 잘못 되었습니다.");
        }
        else{
        id = req_id;
        res.send("회원님의 id는 "+id);
        console.log("Find User ID | ID :"+id+" PWD : "+pwd);
        }
    });
    app.post('/findpw',function(req,res){
        req_id = req.body.id;
        console.log("Request Find PWD : "+req_id);
        console.log("ID : "+id);
        console.log("PWD : "+pwd); 

        if(req_id != id){
            res.send("존재 하지 않는 아이디 입니다.");
        }
        else{
        pwd = req_pwd;
        res.send("회원님의 pw는 "+pwd);
        console.log("Find User PWD | ID :"+id+" PWD : "+pwd);
        }
    });
    app.post('/conect',function(req,res){
    console.log("Connect is Success");
    res.end();
     });
    console.log("server is succes");

    var server = require('http').Server( app );
    server.listen( 3000 );
