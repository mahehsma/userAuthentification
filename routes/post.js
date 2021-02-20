const express = require("express");
const router = express.Router();
const usersMiddleware = require("../middleware/users");
const db = require("../bin/db");

router.get("/:id", usersMiddleware.isLoggedIn, (req, res, next) => {
  const username = req.params.id;
  console.log("request: " + username);
  console.log("from: " + req.userData.username);

  //if authorized (owner or friend)
  if (req.userData.username != username) {
    console.log("is not owner");
    //is owner?
    //is friend?
    var sql = `SELECT user2 FROM follows WHERE user1 = ${db.escape(
      req.userData.userId
    )} AND user1 = (SELECT id FROM users WHERE username = ${db.escape(
      username
    )})`;

    db.query(sql, (err, result) => {
      if (err) return res.status(500).send();
      if (!result[0])
        //empty result -> does not follow
        return res.status(403).send();
    });
  } else {
    var sql = `SELECT post.created, post.heading, post.content FROM post INNER JOIN users ON users.id = post.user WHERE users.username = ${db.escape(
      username
    )}`;
    db.query(sql, (err, result) => {
      if (err) return res.status(404).send();
      else {
        return res.status(200).send(result);
      }
    });
  }
});

router.post("/", usersMiddleware.isLoggedIn, (req, res, next) => {
  const userId = req.userData.userId;
  const heading = req.body.heading;
  const content = req.body.content;
  const sql = `INSERT INTO post(user, created, heading, content) 
  VALUES(${db.escape(userId)}, now(),
    ${db.escape(heading)}, ${db.escape(content)})`;
  db.query(sql, (err, result) => {
    if (err) return res.status(400).send({ msg: err });
  });
  return res.status(201).send({ msg: "post created" });
});

module.exports = router;
