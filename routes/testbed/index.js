var express = require("express");
var mdbConn = require("../../db_connection/mariaDBConn");
var router = express.Router();
const { isLogIn } = require("../auth/auth");
const { checkTokens } = require("../../passport/abouttoken");

/* GET home page. */
router.get("/", isLogIn, checkTokens, function (req, res, next) {
  res.render("test");
});

router.get("/tmp", isLogIn, checkTokens, function (req, res, next) {
  res.render("tmp");
});

router.get("/unit_svc", isLogIn, checkTokens, async function (req, res, next) {
  
  // servce idx
  var sql = "SELECT * FROM service_test WHERE id_idx=?";
  params = req.user.id_idx;
  var rows = await mdbConn.dbSelectall(sql, params);
  res.locals.service_select = rows;

  // data idx
  var sql = "SELECT * FROM data_test WHERE id_idx=?";
  params = req.user.id_idx;
  var rows = await mdbConn.dbSelectall(sql, params);
  res.locals.data_select = rows;


  res.render("unit_svc");
});

router.post("/ServiceSelect", function (req, res, next){
  var data = req.body.data;
  var sql = "SELECT * FROM service_test WHERE service_id=?";  //선택된 서비스의 클라이언트 id와 secret을 가져오기 위한 쿼리
  mdbConn.dbSelect(sql, data)
  .then((rows) => {
    if(rows){
      res.json({ clientid: rows.service_client_id, clientsecret: rows.service_client_secret});
    }else {
      res.send(false);
    }
  });
});

router.post("/ServerSelect", function (req, res, next){
  var data = req.body.data;
  var sql = "SELECT * FROM server_management WHERE server_manage_id=?";  //선택된 서비스의 클라이언트 id와 secret을 가져오기 위한 쿼리
  mdbConn.dbSelect(sql, data)
  .then((rows) => {
    if(rows){
      res.json({ clientip: rows.server_ip});
    }else {
      res.send(false);
    }
  });
});


router.get("inte_svc", isLogIn, checkTokens, async function (req, res, next) {
  res.render("inte_svc");
});


router.get("/unit_api", isLogIn, checkTokens, async function (req, res, next) {
  var sql = "SELECT * FROM server_management WHERE id_idx=?";
  params = req.user.id_idx;
  var rows = await mdbConn.dbSelectall(sql, params);
  res.locals.server_select = rows;
  res.render("unit_api");
});

router.get("inte_api", isLogIn, checkTokens, async function (req, res, next) {
  res.render("inte_api");
});
module.exports = router;

router.post("/DataSelect", function (req, res, next){
  var data = req.body.data;
  var sql = "SELECT * FROM data_test WHERE data_id=?";
  
  mdbConn.dbSelect(sql, data)
  .then((rows) => {
    if(rows){
      res.json({ data_json: rows.data_json});
    }else {
      res.send(false);
    }
  });
});
module.exports = router;

