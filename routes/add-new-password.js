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


router.get('/',checkLoginUser,function(req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    getPassCategory.exec(function(err,data){
      if(err) throw err;
      res.render('addNewPassword', {title: 'Password Management System',loginUser:loginUser, records:data, success:''});
    });
  });
  
  router.post('/',checkLoginUser,function(req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    var pass_cat = req.body.pass_cat;
    var project_name = req.body.project_name;
    var pass_details = req.body.pass_details;
    var password_details = new passModel({
      password_categorys:pass_cat,
      project_name:project_name,
      password_details:pass_details
    });
      password_details.save(function(err, doc){
        getPassCategory.exec(function(err, data){
        if(err) throw err;
        res.render('addNewPassword', {title: 'Password Management System',loginUser:loginUser, records:data, success:'Password details inserted successfully.'});
      });
    });
  });
  

  module.exports = router;