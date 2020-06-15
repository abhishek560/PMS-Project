const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms', {useNewUrlParser:true, useCreateIndex:true});
var conn = mongoose.connection;
var passwordSchema = new mongoose.Schema({
    password_categorys:{
        type:String,
        required:true,
    },

    project_name:{
        type:String,
        required:true,
    },

    password_details:{
        type:String,
        required:true,
    },

    date:{
        type:Date,
        default:Date.now
    }

});

var passModel = mongoose.model('password_details', passwordSchema);
module.exports = passModel;