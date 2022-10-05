var express = require("express");
var mdbConn = require("../../db_connection/mariaDBConn");
var router = express.Router();
const { isLogIn } = require("../auth/auth");
const { checkTokens } = require("../../passport/abouttoken");

/* GET home page. */
router.get("/", isLogIn, checkTokens, function (req, res, next) {
  res.render("test");
});

router.get("/tmp", isLogIn, checkTokens, async function (req, res, next) { //마이데이터 서비스 테스트(단위 테스트)
  var sql = "SELECT * FROM service_test WHERE id_idx=?"; //현재 로그인 된 사용자의 서비스 데이터를 가져오기 위한 쿼리
  params = req.user.id_idx;
  var rows = await mdbConn.dbSelectall(sql, params);
  res.locals.service_select = rows; 
  res.render("tmp");
});

router.get("/unit_svc", isLogIn, checkTokens, async function (req, res, next) {
  var sql = "SELECT * FROM service_test WHERE id_idx=?";
  params = req.user.id_idx;
  var rows = await mdbConn.dbSelectall(sql, params);
  res.locals.service_select = rows;
  res.render("unit_svc");
});

router.post("/ServiceSelet", function (req, res, next){
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
module.exports = router;
