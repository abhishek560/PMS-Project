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


router.get('/' ,checkLoginUser,function(req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    getPassCategory.exec(function(err, data){
      if(err) throw err;
    res.render('passCategory', {title: 'Password Management System',loginUser:loginUser, records:data});
  });
  });

  router.get('/delete/:id' ,checkLoginUser,function(req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    var passcate_id = req.params.id;
    var passcateDelete = passCateModel.findByIdAndDelete(passcate_id);
    passcateDelete.exec(function(err){
      if(err) throw err;
    res.redirect('/passCategory');
  });
  });


  router.get('/edit/:id' ,checkLoginUser,function(req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    var passcate_id = req.params.id;
    var passcateEdit = passCateModel.findById(passcate_id);
    passcateEdit.exec(function(err, data){
      if(err) throw err;
      res.render('edit_passcate', {title: 'Password Management System',loginUser:loginUser,errors:'',success:'', records:data});
  });
  });


  router.post('/edit/' ,checkLoginUser,function(req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    var passcate_id = req.body.id;
    var passcate_name = req.body.passcategory;
    var update_passcate = passCateModel.findOneAndUpdate(passcate_id, {password_category:passcate_name});
    update_passcate.exec(function(err, doc){
      if(err) throw err;
      res.redirect('/passCategory');
  });
  });

  module.exports = router;