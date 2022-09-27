var express = require('express')
var router = express.Router();
const { isLogIn }= require('../auth/auth')
const { checkTokens } = require("../../passport/abouttoken");


/* GET home page. */
router.get('/', isLogIn, checkTokens, function(req, res, next) {
  res.render('test');
});


module.exports = router;