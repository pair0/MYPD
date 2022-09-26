var express = require('express')
var router = express.Router();
const { isLogIn }= require('../auth/auth')
const { checkTokens } = require("../../passport/abouttoken");

/* GET home page. */
router.get('/editcheck', isLogIn, checkTokens, function(req, res, next) {
  res.render('editcheck');
});

router.get('/edit', isLogIn, checkTokens, function(req, res, next) {
  res.render('edit');
});

router.get('/reg_svc', isLogIn, checkTokens, function(req, res, next) {
  res.render('reg_svc');
});

router.get('/reg_svc_no', isLogIn, checkTokens, function(req, res, next) {
  res.render('reg_svc_no');
});

module.exports = router;

