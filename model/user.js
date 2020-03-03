const mongoose = require('mongoose');
const Schema = mongoose.Schema;

SALT_WORK_FACTOR = 10;
const db_schema = new Schema({
name:{type:String},
bgroup:{type:String},
email:{type:String,unique:true},
password : String,
role:{type:String,
enum:['admin','subadmin','user'],
default:'user'
},
is_deleted:{type:Boolean,default:false} 
});





module.exports=mongoose.model('adminapp',db_schema)