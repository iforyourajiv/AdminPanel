const jwt = require("jsonwebtoken");
const key = require("../key");

function checktoken(req, res, next) {
  let token = req.cookies.name;
  console.log("Tokennnnnnnnnnnnn" + token);
  if (!token) {
    res.render("index");
  } else {
    jwt.verify(token, key.sk, function(err, data) {
      if (err) {
        console.log(err);
        res.render("index");
      } else {
        
        let type = data.role;
        req.type = type;
        next();
      }
    });
  }
}

module.exports = {
  checktoken
};
