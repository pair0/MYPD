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
  var sql = "SELECT * FROM service_test WHERE id_idx=?";
  params = req.user.id_idx;
  var rows = await mdbConn.dbSelectall(sql, params);
  res.locals.service_select = rows;
  res.render("tmp");
});

router.post("/ServiceSelet", function (req, res, next){
  var data = req.body.data;
  var sql = "SELECT * FROM service_test WHERE service_id=?";
  mdbConn.dbSelect(sql, data)
  .then((rows) => {
    if(rows){
      res.json({ clientid: rows.service_client_id, clientsecret: rows.service_client_secret});
    }else {
      res.send(false);
    }
  });
});
module.exports = router;
