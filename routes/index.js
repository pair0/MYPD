const express = require("express");
const router = express.Router();

const user = require("./users");
const testbed = require("./testbed");
const about = require("./about");
const aboutapi = require("./aboutapi");
const auth = require("./auth");
const mypage = require("./mypage");
const v1 = require("./v1");

router.use("/user", user);
router.use("/testbed", testbed);
router.use("/about", about);
router.use("/aboutapi", aboutapi);
router.use("/auth", auth);
router.use("/mypage", mypage);
router.use("/v1", v1);

router.get("/", function(req, res, next){
    res.render('home');
})

module.exports = router;
