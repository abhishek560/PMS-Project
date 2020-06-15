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
      res.render('addNewCategory', {title: 'Password Management System',loginUser:loginUser, errors:'', success:''})
  });

  router.post('/',checkLoginUser,[check('passcategory','Enter Password Category Name.').isLength({min:1})],function(req, res, next){
    var loginUser = localStorage.getItem('loginUser');
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.render('addNewCategory', {title: 'Password Management System',loginUser:loginUser,errors:errors.mapped(), success:''});
    } else{
      var passCateName = req.body.passcategory;
      var passCateDetails = new passCateModel({
        password_category:passCateName
      });
      passCateDetails.save(function(err, doc){
        if(err) throw err;
        res.render('addNewCategory', {title: 'Password Management System', loginUser:loginUser,errors:'', success:'Password category inserted successfully.'});
      });
    }
  });

  module.exports = router;