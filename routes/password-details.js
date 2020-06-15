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
    res.redirect('/dashboard');
  });
  router.get('/edit/:id',checkLoginUser,function(req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    var id = req.params.id;
    var getPassDetails = passModel.findById({_id:id});
    getPassDetails.exec(function(err, data){
      if(err) throw err;
      getPassCategory.exec(function(err, data1){
      res.render('edit_passworddetails', {title: 'Password Management System',loginUser:loginUser, records:data1, record:data, success:''});
      });
    });
  });

  router.post('/edit/:id',checkLoginUser,function(req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    var id = req.params.id;
    var passCat = req.body.pass_cat;
    var project_name = req.body.project_name;
    var pass_details = req.body.pass_details;
    passModel.findByIdAndUpdate(id, {password_categorys:passCat, project_name:project_name, password_details:pass_details}).exec(function(err){
      if(err) throw err;
    
    var getPassDetails = passModel.findById({_id:id});
    getPassDetails.exec(function(err, data){
      if(err) throw err;
      getPassCategory.exec(function(err, data1){
      res.render('edit_passworddetails', {title: 'Password Management System',loginUser:loginUser, records:data1, record:data, success:'Password Details Updated Successfully.'});
    });  
    });
    });
  });

  router.get('/delete/:id' ,checkLoginUser,function(req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    var id = req.params.id;
    var passcateDelete = passModel.findByIdAndDelete(id);
    passcateDelete.exec(function(err){
      if(err) throw err;
    res.redirect('/view-all-password');
  });
  });
  

  module.exports = router;