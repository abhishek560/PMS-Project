var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var passCateModel = require('../modules/password_category');
var passModel = require('../modules/add_password');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const { count } = require('../modules/user');
var getPassCategory = passCateModel.find({});
var getAllPass = passModel.find({});

function checkLoginUser(req, res, next){
  var userToken = localStorage.getItem('userToken');
  try{
    var decoded = jwt.verify(userToken, 'loginToken');
  }catch(err){
    res.redirect('/');
  }
  next();
}



if(typeof localStorage === 'undefined' || localStorage === null){
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

var msg = '';
/* GET home page. */
function checkUsername(req,res,next){
  var username = req.body.uname;
  var checkExistUser = userModule.findOne({username:username});
  checkExistUser.exec((err, data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup', { title: 'Password Management System', msg:'Username Already Exist.'});
    }
    next();
  });
}

function checkEmail(req,res,next){
  var email = req.body.email;
  var checkExistEmail = userModule.findOne({email:email});
  checkExistEmail.exec((err, data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup', { title: 'Password Management System', msg:'Email Already Exist.'});
    }
    next();
  });
}



router.get('/', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('/dashboard');
  }else{
  res.render('index', { title: 'Password Management System',  msg:'' });
  }
});
router.post('/', function(req, res, next) {
  var username = req.body.uname;
  var password = req.body.password;

  var checkeUsername = userModule.findOne({username:username});
  checkeUsername.exec((err, data)=>{
    if(err) throw err;

    var getUserId = data._id;
    var getPassword = data.password;
    if(bcrypt.compareSync(password, getPassword)){
      var token = jwt.sign({userId:getUserId}, 'loginToken');
      localStorage.setItem('userToken', token);
      localStorage.setItem('loginUser', username);
      res.redirect('/dashboard');
    }
    else{
      res.render('index', { title: 'Password Management System', msg:'Invalid Username and Password.' });
    }
    
  });
  
});


router.get('/signup', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('/dashboard');
  }else{
  res.render('signup', { title: 'Password Management System',loginUser:loginUser, msg:''});
  }
});
router.post('/signup', checkUsername, checkEmail, function(req, res, next) {
  var username = req.body.uname;
  var email = req.body.email;
  var password = req.body.password;
  var confpassword = req.body.confpassword;

  if(password != confpassword){
    res.render('signup', { title: 'Password Management System', msg:'Password not matched!'});
  }
  else{
    password = bcrypt.hashSync(password, 10);
    var userDetails = new userModule({
      username:username,
      email:email,
      password:password
    });
    userDetails.save((err,doc)=>{
      if(err) throw err;
       res.render('signup', { title: 'Password Management System', msg:'User Registerd Successfully.'});
    });
  }
});


router.get('/logout',function(req, res, next){
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});

module.exports = router;
