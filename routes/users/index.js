var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();
const {body} = require('express-validator');
const {validatorErrorChecker} = require('./valcheck');
const {generateAccessToken , generateRefreshToken, authenticateToken }= require('../../passport/abouttoken')
const emailsend = require("../../lib/mail");
const bcrypt = require('bcrypt');
require("dotenv").config();
;
/* Login */

router.get("/login", function (req, res, next) { // 로그인
  res.render("login");
});
router.get("/admin", authenticateToken, (req, res) => {
  res.render("admin");
});

router.post("/login", async function(req, res) { //로그인 신청
  var sql = `SELECT * FROM Customers_Enterprise WHERE e_customer_id = "${req.body.id}" ;`
  var result = await mdbConn.loginquery(sql);
  if (result == 0){
    res.send(`<script>alert('아이디 혹은 패스워드가 잘못되었습니다.');location.replace("/user/login")</script>`);
  } 
  else {
    bcrypt.compare(req.body.pw, result[0].e_customer_pw, (err, same) => {
      if(!same){
        res.send(`<script>alert('아이디 혹은 패스워드가 잘못되었습니다.2');location.replace("/user/login")</script>`);
      } 
      else{
        const payload = {
          idx : req.body.id_idx
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload,process.env.REFRESH_TOKEN_SECRET);
        const info = {
          "refreshToken": 'Bearer ' + refreshToken,
          "id": result[0].e_customer_id
        };
        
        var sql = "UPDATE Customers_Enterprise SET refresh_token = ?  WHERE e_customer_id = ?";
        var params = [info['refreshToken'], info['id']];

        mdbConn.dbInsert(sql, params)
        .then((rows) => {
          console.log(rows);
        })
        .catch((errMsg) => {
          console.log(errMsg);
        });
        res.cookie('accessToken' , 'Bearer ' + accessToken);
        res.cookie('refreshToken' , 'Bearer ' + refreshToken)
        res.send(`<script>location.replace("/main")</script>`)
      }    
    })
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
      res.redirect('/user/join')
    } else {
        return value;
    }
  }),
  validatorErrorChecker
], (req, res) => {
  const info = {
    "number": req.body.number,
    "id": req.body.id,
    "email" : req.body.f_email+"@"+req.body.s_email 
  };
  bcrypt.hash(req.body.pw,10, function(err, hash) {
    if(err) return next(err)
    info['pw'] = hash;

    var sql = 'INSERT INTO Customers_Enterprise(enterprise_number, e_customer_id, e_customer_pw, e_customer_email) VALUES(?,?,?,?)';
    var params = [info['number'], info['id'], info['pw'], info['email']];

    mdbConn.dbInsert(sql, params)
    .then((rows) => {
      console.log(rows);
    })
    .catch((errMsg) => {
      console.log(errMsg);
    });

    res.send(
      "<script>alert('회원가입이 완료되었습니다.!! ');location.href='/user/login';</" +
      "script>"
    );
  })

});

router.post("/check_overlap", function(req, res, next){ //ID 중복 체크
  const id = req.body.ID;
  var sql = "SELECT e_customer_id FROM Customers_Enterprise WHERE e_customer_id=?";
  mdbConn.dbSelect(sql, id)
  .then((rows) => {
    if(rows){
      res.send(true);
    }else {
      res.send(false);
    }
  })
  .catch((errMsg) => {
    console.log(errMsg);
  }); 
});

router.post("/mail_send", async function (req, res, next) { //메일 발송
    const mail = req.body.mail;

    const number = await emailsend.sendmail(toEmail = mail).catch(console.error);
    if (number) {
        const hashAuth = await bcrypt.hash(number, 12);
        res.cookie('hashAuth', hashAuth, {maxAge: 300000});
        res.send(true);
    } else {
        res.send(false);
    }
});

router.post("/mail_check", function mail_check (req, res, next) { //인증번호 체크
    const mail_check = req.body.mail_check;
    if (req.cookies.hashAuth != undefined){
        const hashAuth = req.cookies.hashAuth;
        try {
            if (bcrypt.compareSync(mail_check, hashAuth)) {
                //res.clearCookie('hashAuth');
                res.send("true");
            } else {
                res.send("인증번호가 올바르지 않습니다.");
            }
        } catch (err) {
            res.send("err");
            console.error(err);
        }
    } else {
        res.send("인증번호 발송을 진행하여 주세요.");
    }
    
});

router.post("/check_all", function(req, res, next){ //회원가입 검증
  const {checkID, checkPW, comparePW, checkMAIL, checkBOX} = req.body;
  if(checkID == "false"){
    res.send("아이디를 다시 확인하여 주세요.");
  } else if(checkPW == "false"){
    res.send("비밀번호를 다시 확인하여 주세요.");
  } else if(comparePW == "false"){
    res.send("비밀번호 확인을 다시 확인하여 주세요.");
  } else if(checkMAIL == "false"){
    res.send("인증번호를 다시 확인하여 주세요.");
  }else if(checkBOX == "false"){
    res.send("기업 회원 약관 및 개인정보 수집 및 이용에 동의를 해주세요!");
  }else{
    res.send(true);
  }
});

// ----------------------ID, PW 찾기------------------------------------------ 

router.get("/find_main", function(req, res, next){ //아이디 패스워드 찾기
  res.render("findIdpw_main");
});

router.get("/find_id", function(req, res, next){ //id 찾기
  res.render("findIdPer");
});

router.post("/find_id", async function(req, res, next){ //id 찾기
    const {f_email, s_email, email_check} = req.body;
    mail = f_email+"@"+s_email;
    const hashAuth = req.cookies.hashAuth;
    try {
        if (bcrypt.compareSync(email_check, hashAuth)) {
            var sql = "SELECT e_customer_id FROM Customers_Enterprise WHERE e_customer_email=?"
            var rows = await mdbConn.dbSelect(sql, mail);
            rows = rows.e_customer_id
            res.cookie('rows', rows, {maxAge: 10});
            res.redirect("/user/findIdPer");
        } else {
            res.send("<script>alert('비정상적인 접근입니다.');location.href='/user/find_id';</" +"script>");
        }
    } catch (err) {
      res.send("<script>alert('해당 이메일이 존재하지 않습니다. 다시 시도해 주세요.!');location.href='/user/find_id';</" +"script>");
    }
});

router.get("/findIdPer", function(req, res, next){ //id 띄우기
  if(req.cookies.row != undefined){
      const row = req.cookies.row; 
      res.render("findIdPer_1", { ID: row });
  } else {
      res.render("home");
  }
});

router.get("/find_pw", function(req, res, next){ //pw 찾기
  res.render("findPwPer");
});

router.post("/find_pw", async function(req, res, next){ //pw 찾기
  const {find_id, f_email, s_email, email_check} = req.body;
  const info = {
    "id": find_id,
    "mail": f_email+"@"+s_email
  };
  try {
    var sql = "SELECT * FROM Customers_Enterprise WHERE e_customer_id=? AND e_customer_email=?"
    params = [info['id'], info['mail']];

    var rows = await mdbConn.dbSelect(sql, params);

    res.cookie('rows', rows, {maxAge: 100000});
    res.redirect("/user/findPwPer");
  } catch (err) {
    res.send("<script>alert('아이디 또는 이메일이 알맞지 않습니다.');location.href='/user/find_pw';</" +"script>");
      console.error(err);
  }
});

router.get("/findPwPer", function(req, res, next){ //pw 초기화 화면
  if(req.cookies.rows != undefined){
      res.render("findPwPer_1");
  } else {
      res.render("home");
  }
});

router.post("/findPwPer", function(req, res, next){ //pw 초기화 실행
  if(req.cookies.rows != undefined){
    rows = req.cookies.rows;
    const {init_pw, init_pw_check} = req.body;
    if(init_pw == init_pw_check){
      bcrypt.hash(init_pw, 10, function(err, hash) {
        if(err) return next(err)
        const info = {
          "pw" : hash,
          "id": rows.e_customer_id,
          "mail": rows.e_customer_email
        };

        var sql = 'UPDATE Customers_Enterprise SET e_customer_pw=? WHERE e_customer_id = ? AND e_customer_email = ?';
        params = [info['pw'], info['id'], info['mail']];
        
        mdbConn.dbInsert(sql, params)
        .then((rows) => {
          console.log(rows);
          res.clearCookie('rows');
        })
        .catch((errMsg) => {
          console.log(errMsg);
        });
    
        res.send(
          "<script>alert('비밀번호가 정상적으로 변경되었습니다.');location.href='/user/login';</" +
          "script>"
        );
      })
    } else {
      res.send("<script>alert('비정상적인 접근입니다.');location.href='/main';</" +"script>");
    }
  }else{
    res.send("<script>alert('세션이 만료되었습니다.');location.href='/main';</" +"script>");
  }
});

module.exports = router;