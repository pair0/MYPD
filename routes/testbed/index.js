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
  console.log("와 여기"+req.user.id_idx);
  var sql = 'SELECT * FROM service_test WHERE id_idx=?'
  params = req.user.id_idx;
  var rows = await mdbConn.dbSelectall(sql, params);
  console.log("asdf"+rows[0].service_id);
  console.log("zxcv"+rows[1].service_id);
  console.log("kkkkk"+rows.length);
  res.locals.service_select = rows;
  res.render('tmp');
});


module.exports = router;