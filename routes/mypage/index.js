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

router.get('/reg_svc', function(req, res, next) {
  res.render('reg_svc');
});

module.exports = router;

