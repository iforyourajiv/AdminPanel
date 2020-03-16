const jwt = require("jsonwebtoken");
const key = require("../key");

function checktoken(req, res, next) {
  let token = req.cookies.name;
  if (!token) {
    let msg=""
    res.render('index.html',{msg});
  } else {
    jwt.verify(token, key.sk, function(err, data) {
      if (err) {
        console.log(err);
        let msg=""
        res.render('index.html',{msg});
      } else {
        console.log(data)
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
