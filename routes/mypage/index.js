var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();


/* GET home page. */
router.get('/editcheck', function(req, res, next) {
  res.render('editcheck');
});

router.get('/edit', function(req, res, next) {
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
});

module.exports = router;

