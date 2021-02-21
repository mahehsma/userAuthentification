var express = require("express");
var router = express.Router();
var db = require("../bin/db");
var bcrypt = require("bcryptjs");
var uuid = require("uuid");
var userMiddleware = require("../middleware/users");

router.get("/", (req, res, next) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("sign-up");
});

router.post(
  "/",
  userMiddleware.validateRegister,
  userMiddleware.alreadyExists,
  (req, res, next) => {
    console.log(req.body.user);
    bcrypt.genSalt((err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) return res.status(500).send({ msg: err });

        const sql = `INSERT INTO users(id, username, password, email, created,last_login) VALUES('${uuid.v4()}', ${db.escape(
          req.body.username
        )}, ${db.escape(hash)}, ${db.escape(req.body.email)}, now(), now());`;

        db.query(sql, (err, result) => {
          if (err) {
            console.log(err);
            return res.status(400).send({ msg: err });
          }
          return res.status(201).send({ msg: "Registered!" });
        });
      });
    });
  }
);

module.exports = router;
