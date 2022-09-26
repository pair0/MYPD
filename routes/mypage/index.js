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

router.get('/editdata', function(req, res, next) {
  res.render('editdata');
});

router.get('/editmty', function(req, res, next) {
  res.render('editmty');
});

/* 테스트 개발 페이지 (나중에 삭제) */
router.get('/tmp', function(req, res, next) {
  res.render('tmp');
router.get('/reg_svc', isLogIn, function(req, res, next) {
  res.render('reg_svc');
});

router.get('/reg_svc_no', isLogIn, function(req, res, next) {
  res.render('reg_svc_no');
});

module.exports = router;

