 var express = require("express");
var mdbConn = require("../../db_connection/mariaDBConn");
var router = express.Router();
const { isLogIn } = require("../auth/auth");
const { checkTokens } = require("../../passport/abouttoken");

/* GET home page. */
router.get("/", isLogIn, checkTokens, function (req, res, next) {
  res.render("test");
});

router.get("/tmp", isLogIn, checkTokens, async function (req, res, next) {
  console.log("와 여기" + req.user.id_idx);
  var sql = "SELECT * FROM service_test WHERE id_idx=?";
  params = req.user.id_idx;
  var rows = await mdbConn.dbSelectall(sql, params);
  res.locals.service_select = rows;
  res.render("tmp");
});


router.get('/unit_svc', isLogIn, checkTokens, function(req, res, next) {
  res.render('unit_svc');
});



router.post("/ServiceSelet", async function (req, res, next){
  var data = req.body.data;
  var sql = "SELECT * FROM service_test WHERE service_id=?";
  var rows = await mdbConn.dbSelect(sql, data);
  res.send(rows);
});
module.exports = router;
