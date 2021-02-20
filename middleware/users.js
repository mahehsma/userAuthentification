var jwt = require("jsonwebtoken");
var db = require("../bin/db");

module.exports = {
  validateRegister: (req, res, next) => {
    if (!req.body.username || req.body.username < 5) {
      return res
        .status(400)
        .send({ msg: "Please enter a username with min 5 chars" });
    }

    if (!req.body.password || req.body.password < 6) {
      return res
        .status(400)
        .send({ msg: "Please enter a password with min 6 chars" });
    }

    if (
      !req.body.password_repeat ||
      req.body.password != req.body.password_repeat
    ) {
      return res.status(400).send({ msg: "Both passwords must match" });
    }

    if (!req.body.email || req.body.email < 5) {
      return res.status(400).send({ msg: "Please enter a valid email" });
    }
    next();
  },

  alreadyExists: (req, res, next) => {
    db.query(
      `SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(
        req.body.username
      )});`,
      (err, result) => {
        if (result.length) {
          return res
            .status(409)
            .send({ msg: `Username ${req.body.username} already exists` });
        } else {
          next();
        }
      }
    );
  },

  isLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "SECRETKEY");
      req.userData = decoded;
      next();
    } catch (err) {
      return res.status(401).send({ msg: "Your session is invalid!" });
    }
  },
};
