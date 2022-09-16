var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();
/* Login */

router.get("/login", function (req, res, next) { // 로그인
  res.render("login");
});

router.post("/login", async function(req, res) { //로그인 신청
  var id = req.body.id;
  var pw = req.body.pw;
  var sql = `SELECT * FROM Customers_Enterprise WHERE e_customer_id = "${id}" and e_customer_pw = "${pw}";`
  var result = await mdbConn.loginquery(sql,'mypd');
  if (result == 0){
    res.send(`<script>alert('아이디 혹은 패스워드가 잘못되었습니다.');location.replace("/user/login")</script>`);
  } 
  else {
    var username = result[0].e_customer_id;
    res.send(`<script>alert('로그인 성공! ${username}님 안녕하세요!');location.replace("../../views/home")</script>`);
  }
}) 
/* GET users listing. */

router.get("/join", function (req, res, next) { // 회원가입
  res.render("join");
});

router.post("/join", function(req, res, next){ // 회원가입 신청
  const info = {
    "number": req.body.e_number,
    "id": req.body.e_id,
    "pw" : req.body.e_pw,
    "email" : req.body.e_frist_email+"@"+req.body.e_second_email 
  };
  var sql = 'INSERT INTO Customers_Enterprise(enterprise_number, e_customer_id, e_customer_pw, e_customer_email) VALUES(?,?,?,?)';
  var params = [info['number'], info['id'], info['pw'], info['email']];
  mdbConn.dbInsert(sql, params);
  res.send(
    "<script>alert('회원가입 신청 완료되었습니다.!! 승인 완료 시 해당 이메일로 승인 메일이 발송됩니다.');location.href='/login';</" +
    "script>"
  );
});

module.exports = router;
