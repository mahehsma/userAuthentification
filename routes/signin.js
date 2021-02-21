var express = require("express");
var router = express.Router();
var db = require("../bin/db");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fs = require("fs");
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile("/public/html/signin.html", { root: path.dirname(__dirname) });
});

router.post("/", (req, res, next) => {
  const sql = `SELECT * FROM users WHERE username = ${db.escape(
    req.body.username
  )};`;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(400).send({ msg: err });
    }
    if (!result.length) {
      return res.status(401).send({ msg: "Username or password incorrect!" });
    }

    bcrypt.compare(req.body.password, result[0].password, (bErr, bResult) => {
      if (bErr) {
        return res.status(401).send({ msg: "Username or password incorrect!" });
      }
      if (bResult) {
        const token = jwt.sign(
          {
            username: result[0]["username"],
            userId: result[0].id,
          },
          "SECRETKEY",
          {
            expiresIn: "30min",
          }
        );

        db.query(
          `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
        );

        return res.status(200).send({ msg: "logged in!", token });
      }
      return res.status(401).send({ msg: "Username or password incorrect!" });
    });
  });
});

module.exports = router;
