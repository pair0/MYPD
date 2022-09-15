var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();

/* Login */

router.get("/login", function (req, res, next) { // 로그인
  res.render("login");
});

router.post("/login", function(req, res, next) { //로그인 신청
  console.log("id 값"+req.body.id)
  console.log("pw 값"+req.body.pw)  
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
