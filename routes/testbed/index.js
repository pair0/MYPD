var express = require("express");
var mdbConn = require("../../db_connection/mariaDBConn");
var router = express.Router();
const individual = require("../v1/oauth/2.0/individual")
const { isLogIn } = require("../../controller/login");
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
      res.json({ clientip: rows.server_ip, business_right: rows.business_right});
    }else {
      res.send(false);
    }
  });
});

router.post("/selectServer", function (req, res, next){
  var data = req.body.data;
  req.session.server = data;
  res.json({url : data});
});

router.get("inte_svc", isLogIn, checkTokens, function (req, res, next) {
  res.render("inte_svc");
});

router.get("/unit_api", isLogIn, checkTokens, async function (req, res, next) {
  var sql = "SELECT * FROM server_management WHERE id_idx=?";
  params = req.user.id_idx;
  var rows = await mdbConn.dbSelectall(sql, params);
  res.locals.server_select = rows;
  res.render("unit_api");
});

router.get("/inte_api", isLogIn, checkTokens, function (req, res, next) {
  res.render("inte_api");
});

router.get("/inte_api_access", isLogIn, checkTokens, function (req, res, next) {
  if(req.session.code != undefined && req.session.code != null){
    var code = req.session.code
    req.session.code = null;
    res.locals.CODE = code;
    res.render("inte_api_access");
  } else {
    res.redirect('/main');
  }
});

router.post("/inte_api_access", isLogIn, checkTokens, individual.authorization_api);

router.post("/inte_api_final", isLogIn, checkTokens, individual.token_api);

router.get("/inte_api_final", isLogIn, checkTokens, async function (req, res, next) {
  if(req.session.code_final != undefined && req.session.code_final != null){
    var code_final = req.session.code_final;
    req.session.code_final = null;
    var sql = "SELECT * FROM server_management WHERE id_idx=?";
    params = req.user.id_idx;
    var rows = await mdbConn.dbSelectall(sql, params);
    res.locals.C_FINAL = code_final;
    res.locals.server_select = rows;

    res.render("inte_api_final");
  } else {
    res.redirect('/main');
  }
});

router.get("/test1", isLogIn, checkTokens, async function (req, res, next) {
    var sql = "SELECT * FROM server_management WHERE id_idx=?";
    params = req.user.id_idx;
    var rows = await mdbConn.dbSelectall(sql, params);
    res.locals.server_select = rows;

    res.render("test1");
});

router.get("/popup", isLogIn, checkTokens, function (req, res, next) {
  res.render("popup");
});

router.post("/moneylist", isLogIn, checkTokens, function (req, res, next) {
  res.send("<script>alert('인증에 성공하였습니다.');location.href='/testbed/moneylist';</" + "script>");
});

router.get("/moneylist", isLogIn, checkTokens, function (req, res, next) {
  res.render("moneylist");
});

router.get("/popup_api_select", isLogIn, checkTokens, function (req, res, next) {
  res.render("popup_api_select");
});

router.get("/test1", isLogIn, checkTokens, function(req, res, next){
  res.render("test1");
});

router.post("/DataSelect", isLogIn, checkTokens, async function (req, res, next) {
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

