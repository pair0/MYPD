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

router.get('/editdata', isLogIn, checkTokens, function(req, res, next) {
  res.render('editdata');
});

router.get('/editmty', isLogIn, checkTokens, function(req, res, next) {
  res.render('editmty');
});

/* 테스트 개발 페이지 (나중에 삭제) */
router.get('/tmp', isLogIn, checkTokens, function(req, res, next) {
  res.render('tmp');
});

router.get('/reg_svc', isLogIn, checkTokens, function(req, res, next) {
  res.render('reg_svc');
});

router.get('/reg_svc_no', isLogIn, checkTokens, function(req, res, next) {
  res.render('reg_svc_no');
});

router.get('/reg_link', isLogIn, checkTokens, function(req, res, next) {
  res.render('reg_link');
});

module.exports = router;

