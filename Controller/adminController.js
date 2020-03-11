module.exports = {
  dash,
  adminlogin,
  registersubadmin,
  subadminaction,
  subadminaction_del,
  subadminaction_mod,
  subadminupdate,
  add_user,
  useraction,
  user_del,
  user_mod,
  user_update,
  checkType,
  deleted,
  restore,
  logout,
  eMail,
  chk_pswd,
  change_pswd
};

const data = require("../model/user");
const mailer = require("nodemailer");
const generator = require("generate-password");
var alert = require("alert-node");
const jwt = require("jsonwebtoken");
const key = require("../key");
var cookieParser = require("cookie-parser");

function dash(req, res) {
  res.redirect("/");
}

/* Email */

var transporter = mailer.createTransport({
  service: "Gmail",
  auth: {
    user: "sddrajiv@gmail.com",
    pass: "9931392583"
  }
});

function eMail(email, password, req, res) {
  let mailOptions = {
    from: "sddrajiv@gmail.com",
    to: email,
    subject: "Registration",
    html:
      "Thanking You For Registering Your Email: " +
      email +
      " Password: " +
      password
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

function checkType(req, res, next) {
  let type =req.type;
  if (type == "admin") {
    next();
  } else {
    alert("You Are Not authorized !!! only admin is authorized");
    res.redirect("/");
    console.log(type);
  }
}

/* Admin Login */

function adminlogin(req, res) {
  let username = req.body.admin_name;
  let password = req.body.admin_password;
  console.log(username,password)
  data.findOne({ 'email': username }, function(err, result) {
    if (err) {
      res.render(err);
    } 
    else if (data == null) {
      
      res.redirect("/");
    }
    else{
      result.comparePassword(password,function(err,isMatch){
        if(err){
          console.log(err)
        }
        console.log(isMatch);
        if(isMatch){
          
      jwt.sign(
        { id: result.id, role: result.role },
        key.sk,
        { expiresIn: "5m" },
        function(err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log("tokennnnnn" + data);
            res.cookie("name", data).render("dashboard.html");
          }
        }
      );

        }
     else{
          alert("Wrong id And Password");
        }
       
      })
    }
  })
}
  
/* Sub-Admin Registration */

function registersubadmin(req, res) {
  let name = req.body.name;
  let bgroup = req.body.bgroup;
  let email = req.body.email;
  let password = generator.generate({
    length: 10
  });
  let role = "subadmin";
  console.log(name, bgroup, email, password, role);
  let reg = new data({ name, bgroup, email, password, role });

  reg.save(function(err) {
    if (err) {
      alert("All Ready Registered");
      res.redirect("/dashboard/subadminreg");
    } else {
      eMail(email, password);
      alert("SubAdmin Has Been Registered Successfully, Email Sent");
      res.redirect("/dashboard/subadminreg");
    }
  });
}

/* Sub-Admin Actions(Edit,Del)*/

function subadminaction(req, res) {
  data.find({ role: "subadmin", is_deleted: "false" }, function(err, data) {
    record = data;
    res.render("subadminaction.html", { record });
  });
}

function subadminaction_del(req, res) {
  let id = req.params.id;
  data.findOneAndUpdate(
    { _id: id },
    { $set: { is_deleted: "true" } },
    (err, data) => {
      if (err) {
        alert("error");
      } else {
        alert("deleted");
        res.redirect("/dashboard/subadminaction");
      }
    }
  );
}

function subadminaction_mod(req, res) {
  let id = req.params.id;
  data.findById({ _id: id }, (err, data) => {
    record = data;
    console.log({ record });
    res.render("subadminactionmodify.html", { record });
  });
}

function subadminupdate(req, res) {
  let name = req.body.name;
  let bgroup = req.body.bgroup;
  let id = req.body.id;
  data.findByIdAndUpdate(
    { _id: id },
    { $set: { name: name, bgroup: bgroup } },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        alert("Updated SuccessFully");
        res.redirect("/dashboard/subadminaction");
      }
    }
  );
}

/*user Actions */

function add_user(req, res) {
  let name = req.body.name;
  let bgroup = req.body.bgroup;
  let email = req.body.email;
  let password = generator.generate({
    length: 10
  });
  
  let role = "user";

  console.log(name, bgroup, email, password, role);
  let reg = new data({ name, bgroup, email, password, role });

  reg.save(function(err) {
    if (err) {
      alert("All Ready Registered");
      res.redirect("/dashboard/userreg");
    } else {
      eMail(email, password);
      alert("User Has Been Registered Successfully, Email Sent");
      res.redirect("/dashboard/userreg");
    }
  });
}

function useraction(req, res) {
  data.find({ role: "user", is_deleted: "false" }, function(err, data) {
    record = data;
    res.render("userregaction.html", { record });
  });
}

function user_del(req, res) {
  let id = req.params.id;
  data.findOneAndUpdate(
    { _id: id },
    { $set: { is_deleted: "true" } },
    (err, data) => {
      if (err) {
        alert("error");
      } else {
        alert("deleted");
        res.redirect("/dashboard/userregaction");
      }
    }
  );
}

function user_mod(req, res) {
  let id = req.params.id;
  data.findById({ _id: id }, (err, data) => {
    record = data;
    console.log({ record });
    res.render("usermodify.html", { record });
  });
}

function user_update(req, res) {
  let name = req.body.name;
  let bgroup = req.body.bgroup;
  let id = req.body.id;
  data.findByIdAndUpdate(
    { _id: id },
    { $set: { name: name, bgroup: bgroup } },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        alert("Updated SuccessFully");
        res.redirect("/dashboard/userregaction");
      }
    }
  );
}

function deleted(req, res) {
  data.find({ is_deleted: "true" }, function(err, data) {
    record = data;
    res.render("deleted.html", { record });
  });
}

function restore(req, res) {
  let id = req.params.id;
  data.findOneAndUpdate(
    { _id: id },
    { $set: { is_deleted: "false" } },
    (err, data) => {
      if (err) {
        alert("error");
      } else {
        alert("Restored");
        res.redirect("/dashboard/deleted");
      }
    }
  );
}

function logout(req, res) {
  res.clearCookie("name").redirect("/");
}


function chk_pswd(req,res){
  let id = req.params.id;
  data.findById({ _id: id }, (err, data) => {
    record = data;
    console.log({ record });
    res.render("change_password.html", { record });
  });
}


function change_pswd(req,res){
 
  let id = req.body.id;
  let password=req.body.password;
  data.findById({ _id: id },(err,result)=>{
    if(err){
      console.log("error");
    }
    else if(data == null){
      console.log(err)
    }
    else{
      result.password=password;
      result.save((err)=>{
        if(err){}
        else{
          alert("Password Changed SuccessFully");
          res.redirect("/");
        }
      })
    }
    
  })
 
}

