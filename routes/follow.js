const express = require("express");
const router = express.Router();
const db = require("../bin/db");
const usersMiddelware = require("../middleware/users");

router.post("/:id", usersMiddelware.isLoggedIn, (req, res) => {
  const sql = `INSERT INTO follows(user1, user2, since, status) VALUES(${db.escape(
    req.userData.userId
  )}, (SELECT id FROM users WHERE username = ${db.escape(
    req.params.id
  )}), now(), 'pending');`;

  db.query(sql, (err, result) => {
    if (err) return res.status(404).send({ msg: "user not found" });
    return res.status(201).send({ msg: "new follow request: 'pending'" });
  });
});

router.get("/", (req, res) => {}); //get users that logged in user follows

router.get("/:id", (req, res) => {}); //get users that :id follows if public or follows

module.exports = router;
