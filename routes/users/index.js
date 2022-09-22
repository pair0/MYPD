var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();
const {body} = require('express-validator');
const {validatorErrorChecker} = require('./valcheck');
const emailsend = require("../../lib/mail");
const bcrypt = require('bcrypt');
/* Login */

router.get("/login", function (req, res, next) { // 로그인
  res.render("login");
});

router.post("/login", async function(req, res) { //로그인 신청
  var id = req.body.id;
  var pw = req.body.pw;
  
  var sql = `SELECT * FROM Customers_Enterprise WHERE e_customer_id = "${id}" ;`
  var result = await mdbConn.loginquery(sql);
  if (result == 0){
    res.send(`<script>alert('아이디 혹은 패스워드가 잘못되었습니다.');location.replace("/user/login")</script>`);
  } 
  else {
    bcrypt.compare(pw, result[0].e_customer_pw, (err, same) => {
      if(!same){
        res.send(`<script>alert('아이디 혹은 패스워드가 잘못되었습니다.2');location.replace("/user/login")</script>`);
      } 
      else{
        var username = result[0].e_customer_id;
        res.send(`<script>alert('로그인 성공! ${username}님 안녕하세요!');location.replace("../../main/")</script>`);  
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
        // return res.send(`<script>alert('악성 사용자 꺼저라 시발련아! ');location.replace("../../user/join")</script>`);   
        return res.status(400).json({ errors: errors.array() });
    } else {
        return value;
    }
  }),
  validatorErrorChecker
], async (req, res) => {
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
    "<script>alert('회원가입 신청 완료되었습니다.!! 승인 완료 시 해당 이메일로 승인 메일이 발송됩니다.');location.href='/user/login';</" +
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

    number = await emailsend.sendmail(toEmail = mail).catch(console.error);
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
    const hashAuth = req.cookies.hashAuth;

    try {
        if (bcrypt.compareSync(mail_check, hashAuth)) {
            res.send(true);
        } else {
            res.send(false);
        }
    } catch (err) {
        res.send(false);
        console.error(err);
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
    res.send("true");
  }
});

router.get("/find_main", function(req, res, next){ //아이디 패스워드 찾기
  res.render("findIdpw_main");
});

router.get("/findIdPer", function(req, res, next){ //id 찾기
    var row=req.query.id;
    console.log("여기"+row);
    res.render("findIdPer_1", { ID: row });
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
            res.cookie('hashAuth', hashAuth, {maxAge: 300000});
            console.log("찾는 아이디 : "+ rows);
            res.redirect("/user/findIdPer?id="+rows);
        } else {
            res.send("<script>alert('비정상적인 접근입니다.');location.href='/user/find_id';</" +"script>");
        }
    } catch (err) {
        res.send(false);
        console.error(err);
    }
    
});

router.get("/find_pw", function(req, res, next){ //pw 찾기
  res.render("findPwPer");
});

module.exports = router;