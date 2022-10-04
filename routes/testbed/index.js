var express = require('express')
var mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();
const { isLogIn }= require('../auth/auth')
const { checkTokens } = require("../../passport/abouttoken");


/* GET home page. */
router.get('/', isLogIn, checkTokens, function(req, res, next) {
  res.render('test');
});

router.get('/tmp', isLogIn, checkTokens, async function(req, res, next) {
  console.log("와 여기"+req.user);
  var sql = 'SELECT * FROM service_test WHERE id_idx=?'
  params = req.user.id_idx;
  var rows = await mdbConn.dbSelect(sql, params);
  console.log(rows);
  res.render('tmp');
});


module.exports = router;