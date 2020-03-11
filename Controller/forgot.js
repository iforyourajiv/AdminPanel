module.exports = {
  forgot,
  reset,
  checkrole
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

function eMail(email, password, cb) {
  let mailOptions = {
    from: "sddrajiv@gmail.com",
    to: email,
    subject: "Registration",
    html:
      "Your Password Is Updated for Email: " + email + " Password: " + password
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      cb(error);
    } else {
      cb(null, "Email sent: " + info.response);
    }
  });
}

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
  let password = generator.generate({
    length: 10
  });
  console.log(email);
  eMail(email, password, function cb(err, result) {
    if (err) {
    } else {
      data.findOneAndUpdate(
        { email: email },
        { $set: { password: password } },
        function(err, data) {
          if (err) {
          } else {
            alert("SuccessFully sent Your Password");
            res.render("index.html");
          }
        }
      );
    }
  });
}
