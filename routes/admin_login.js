var express = require('express');
var router = express.Router();
const mongoose=require('mongoose');
const data=require('../model/user');
const login=require('../Controller/adminController')

/* GET home page. */
// router.post('/dashboard',login.adminlogin)

// router.use('/dashboard/subadminreg')
   
    
    // let name='admin';
    // let email='admin@gmail.com'
    // let bgroop='A+';
    // let password='12345'
    // var detail=new data({name,email,bgroop,password});
    // detail.save(function(err,data){
    //     if(err){
    //     console.log("failed");
    //     }
    //     else{
    //         console.log("save Succesfully");
    //     }
    // });

  


module.exports = router;
