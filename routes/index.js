var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const data = require("../model/user");
const admin = require("../Controller/adminController");
const auth = require("../auth/auth");

/* GET home page. */
router.get("/",auth.checktoken,function(req, res, next) {
  // let name='admin';
  // let email='admin@gmail.com'
  // let bgroup='A+';
  // let password='12345'
  // var detail=new data({name,email,bgroup,password});
  // detail.save(function(err,data){
  //     if(err){
  //     console.log("failed");
  //     }
  //     else{
  //         console.log("save Succesfully");
  //     }
  // });

  res.render("dashboard.html");
});

router.post("/dashboard",admin.adminlogin);
router.get("/dashboard/subadminreg", auth.checktoken, admin.checkType, function(
  req,
  res
) {
  res.render("subadminreg.html");
});
router.post(
  "/dashboard/subadminregsave",
  auth.checktoken,
  admin.checkType,
  admin.registersubadmin
);
router.get(
  "/dashboard/subadminaction",
  auth.checktoken,
  admin.checkType,
  admin.subadminaction
);
router.get(
  "/dashboard/subadminaction_del/:id",
  auth.checktoken,
  admin.checkType,
  admin.subadminaction_del
);
router.get(
  "/dashboard/subadminaction_mod/:id",
  auth.checktoken,
  admin.checkType,
  admin.subadminaction_mod
);
router.post(
  "/dashboard/subadminupdate",
  auth.checktoken,
  admin.checkType,
  admin.subadminupdate
);

/* User Routes */

router.get("/dashboard/userreg",auth.checktoken, function(req, res) {
  res.render("Add_user.html");
});

router.post("/dashboard/userreg_save", auth.checktoken, admin.add_user);
router.get("/dashboard/userregaction", auth.checktoken, admin.useraction);
router.get("/dashboard/user_del/:id", auth.checktoken, admin.user_del);
router.get("/dashboard/user_mod/:id", auth.checktoken, admin.user_mod);
router.post("/dashboard/user_update", auth.checktoken, admin.user_update);

router.get("/logout",admin.logout);
module.exports = router;
