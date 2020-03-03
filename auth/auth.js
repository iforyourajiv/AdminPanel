const jwt = require("jsonwebtoken");
const key = require("../key");

function checktoken(req, res, next) {
  let token = req.cookies.name;
  if (!token) {
    res.render('index.html');
  } else {
    jwt.verify(token, key.sk, function(err, data) {
      if (err) {
        console.log(err);
        res.render('index.html');
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
