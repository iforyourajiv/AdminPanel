module.exports = {
  forgot,
  reset
};

const data = require("../model/user");
const mailer = require("nodemailer");
const generator = require("generate-password");
var alert = require("alert-node");

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
      "Your Password Is Updated for Email: " +
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



function forgot(req, res) {
  res.render("forgot-password.html");
}

function reset(req, res) {
  let email = req.body.email;
  let password = generator.generate({
    length: 10
  });
  console.log(email);
  data.findOneAndUpdate({ 'email': email},{$set:{'password':password}} , function(err, data) {
    if (err) {
    } 
    
    else {
        eMail(email,password)
        res.render('index.html');
    
      
    }
  });
}
