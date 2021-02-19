var express = require("express");
var router = express.Router();
var userMiddleware = require("../middleware/users")

router.get("/", userMiddleware.isLoggedIn, (req, res, next) => {
    return res.status(200).send({msg: "secret..."});
});

module.exports = router;