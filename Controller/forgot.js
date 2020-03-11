module.exports = {
  forgot,
  reset,
  recoverpage,
  savereset,
  checkrole
};

const data = require("../model/user");
const mailer = require("nodemailer");
const generator = require("generate-password");
var alert = require("alert-node");
const jwt = require("jsonwebtoken");

var transporter = mailer.createTransport({
  service: "Gmail",
  auth: {
    user: "sddrajiv@gmail.com",
    pass: "9931392583"
  }
});



function forgot(req, res) {
  res.render("forgot-password.html");
}

function checkrole(req, res, next) {
  let email = req.body.email;
  data.findOne({ email: email }, function(err, data) {
    if (err) {
    } else {
      let role = data.role;
      if (role == "subadmin") {
        alert("Not Authorized");
      } else {
        next();
      }
    }
  });
}

function reset(req, res) {
  let email = req.body.email;
  console.log(email);
  data.findOne({'email':email},(err,result)=>{
if(err){
  console.log(err);
}
else if(result==null){
  alert("Plz Enter registered Email");
  res.render("reset.html");
}

else if(result.role=='subadmin'){
alert("Not Authorized");
}
 
else {
  let id=result.id;
  let role="auth";
  console.log(id,role)
  jwt.sign({'id':id,'role':role},"rajiv",{expiresIn:'10m'},function(err,token){
    if(err){
      console.log(err)
    }
    else{
      console.log(token);
        let mailOptions = {
          from: "sddrajiv@gmail.com",
          to: email,
          subject: "Registration",
          html :'<p> <a href = "http://localhost:3000/recover/'+token+'">Click Here </a>to reset your password </p>'
        };
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
           console.log("there is some error")
          } else {
            console.log("Email sent: " + info.response);
            result.resetCheck=token;
                                result.save((err)=>{
                                    if(err){
                                        res.json("Error")
                                    }
                                    else{
                                      alert("Reset Link Successfully Sent to the  "+email);
                                        res.redirect('/');
                                    }
                                })
          }
        });
     

    }

  })
}

  })
}


function recoverpage(req,res){
  let token=req.params.id;
  console.log("kskjdskjfnsjkfnsfnsflknsdf"+token)
  jwt.verify(token,"rajiv",(err,result)=>{
      if(err){
          res.json("Invalid Token");
      }
      else{
          let id =result.id;
          let role=result.role;
          
          if(role == 'auth'){
                  
                  data.findOne({'_id':id,'resetCheck':token},(err,data)=>{
                      if(err){
                          res.json("Error")
                      }
                      else if(data == null){
                          res.redirect('/')

                      }
                      else{
                          let email=data.email;
                          res.render('resetpass.html',{id,email,token});
                      }

                  })
          }
          else{
              res.json("Invalid")
          }
      }
  })

}


function savereset(req,res){
  let id=req.body.id;
  let pass=req.body.password;
  let token=req.body.token;
  data.findOne({'_id':id},function(err,result){
      if(err){}
      else if(result == null){}
      else{
          result.password=pass;
         result.resetCheck=undefined;
         result.save((err)=>{
              if(err){}
              else{
                alert("Password Successfully Changed")
                  res.redirect('/');
              }
          })
      }
  })
}




