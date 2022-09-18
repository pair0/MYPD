var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();
const { body } = require('express-validator');
const { validatorErrorChecker } = require('./valcheck');
/* Login */

router.get("/login", function (req, res, next) { // 로그인
  res.render("login");
});

router.post("/login", async function(req, res) { //로그인 신청
  var id = req.body.id;
  var pw = req.body.pw;
  var sql = `SELECT * FROM Customers_Enterprise WHERE e_customer_id = "${id}" and e_customer_pw = "${pw}";`
  var result = await mdbConn.loginquery(sql);
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

router.post('/join', [
  body('number').notEmpty().bail().trim().withMessage('사업자 번호를 확인해주세요.').bail(),
  body('id').notEmpty().bail().trim().isLength({min:5 , max:20}).isAlphanumeric('en-US',  {ignore: '_-'}).withMessage('id를 확인해주세요.').bail(),
  body('pw').notEmpty().bail().trim().isLength({min:8, max:16}).isAlphanumeric('en-US',  {ignore: '~!@#$%^&*()_+|<>?:{}]/;'}).isStrongPassword({
    minLowercase : 0,
    minUppercase : 0
  }).withMessage('비밀번호를 확인해주세요.').bail(),
  body('pw_check').custom((value,{req, res, path}) => {
    if (value !== req.body.pw) {
        // trow error if passwords do not match
        return res.send(`<script>alert('악성 사용자 꺼저라 시발련아! ');location.replace("../../user/join")</script>`);   
    } else {
        return value;
    }
  }),
  validatorErrorChecker
], (req, res) => {
  const info = {
    "number": req.body.number,
    "id": req.body.id,
    "pw" : req.body.pw,
    "email" : req.body.f_email+"@"+req.body.s_email 
  };
  var sql = 'INSERT INTO Customers_Enterprise(enterprise_number, e_customer_id, e_customer_pw, e_customer_email) VALUES(?,?,?,?)';
  var params = [info['number'], info['id'], info['pw'], info['email']];
  mdbConn.dbInsert(sql, params);
  res.send(
    "<script>alert('회원가입 신청 완료되었습니다.!! 승인 완료 시 해당 이메일로 승인 메일이 발송됩니다.');location.href='/user/login';</" +
    "script>"
  );
});

module.exports = router;
