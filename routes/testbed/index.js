var express = require('express')
var router = express.Router();
const { isLogIn }= require('../auth/auth')
const { checkTokens } = require("../../passport/abouttoken");

/* GET home page. */
router.get('/', isLogIn, checkTokens, function(req, res, next) {
  res.render('test');
});

/* 테스트 개발 페이지 (나중에 삭제) */
router.get('/tmp', isLogIn, checkTokens, function(req, res, next) {
  res.render('tmp');
});


module.exports = router;