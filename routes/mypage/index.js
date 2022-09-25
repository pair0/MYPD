var express = require('express')
var router = express.Router();
const { isLogIn }= require('../auth/auth')

/* GET home page. */
router.get('/editcheck', isLogIn, function(req, res, next) {
  res.render('editcheck');
});

router.get('/edit', isLogIn, function(req, res, next) {
  res.render('edit');
});

router.get('/reg_svc', isLogIn, function(req, res, next) {
  res.render('reg_svc');
});

router.get('/reg_svc_no', isLogIn, function(req, res, next) {
  res.render('reg_svc_no');
});

module.exports = router;

