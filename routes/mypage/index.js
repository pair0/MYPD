var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();
const {body} = require('express-validator');
const {validatorErrorChecker} = require('../users/valcheck');
const bcrypt = require('bcrypt');
const { isLogIn, isSNSLogIn}= require('../auth/auth')
const { checkTokens } = require("../../passport/abouttoken");

/* GET home page. */
router.get('/editcheck', isLogIn, isSNSLogIn, checkTokens, function(req, res, next) {
  res.render('editcheck');
});

router.post('/editcheck', async function(req, res, next){
  console.log(req.session.passport.user.id);
  var sql = "SELECT * FROM Customers_Enterprise WHERE e_customer_id=?";
  var params = req.session.passport.user.id;
  var result = await mdbConn.dbSelect(sql, params);
  console.log(result);
  bcrypt.compare(req.body.pw_Check, result.e_customer_pw, (err, same) => {
    if(!same){
      res.send(`<script>alert('패스워드가 맞지 않습니다.');location.replace("/mypage/editcheck")</script>`);
    } else{
     res.redirect('/mypage/edit'); 
    };
  });
});

router.get('/edit', isLogIn, checkTokens, function(req, res, next) {
  res.render('edit');
});

router.post('/edit', [
  body('nickname').notEmpty().bail().trim().isLength({min:5 , max:20}).isAlphanumeric('en-US',  {ignore: '_-'}).withMessage('닉네임을 확인해주세요.').bail(),
  body('pw').notEmpty().bail().trim().isLength({min:8, max:16}).isAlphanumeric('en-US',  {ignore: '~!@#$%^&*()_+|<>?:{}]/;'}).isStrongPassword({
    minLowercase : 0,
    minUppercase : 0
  }).withMessage('비밀번호를 확인해주세요.').bail(),
  body('pw_check').custom((value,{req, res, path}) => {
    if (value !== req.body.pw) {
      res.redirect('/mypage/edit')
    } else {
        return value;
    }
  }),
  validatorErrorChecker
], (req, res) => {
  const info = {
    "id" : req.session.passport.user.id,
    "nickname" : req.body.nickname,
    "email" : req.body.f_email+"@"+req.body.s_email 
  };
  bcrypt.hash(req.body.pw,10, function(err, hash) {
    if(err) return next(err)
    info['pw'] = hash;

    var sql = 'UPDATE Customers_Enterprise set nickname=?, e_customer_pw=?, e_customer_email=? WHERE e_customer_id=?';
    var params = [info['nickname'], info['pw'], info['email'], info['id']];

    mdbConn.dbInsert(sql, params)
    .then((rows) => {
      console.log(rows);
    })
    .catch((errMsg) => {
      console.log(errMsg);
    });

    res.send(
      "<script>alert('회원 정보 수정이 완료되었습니다.!! ');location.href='/main';</" +
      "script>"
    );
  })
});

router.get('/editdata', isLogIn, checkTokens, function(req, res, next) {
  res.render('editdata');
});

router.get('/editmty', isLogIn, checkTokens, function(req, res, next) {
  res.render('editmty');
});


router.get('/reg_svc', isLogIn, checkTokens, function(req, res, next) {
  res.render('reg_svc');
});

router.get('/reg_svc_list', isLogIn, checkTokens, mdbConn.dbCheck, function(req, res, next) {
  res.render('reg_svc_list');
});

router.get('/reg_svc_no', isLogIn, checkTokens, function(req, res, next) {
  res.render('reg_svc_no');
});

//키 발급
router.get('/key_gen',(req,res,next)=>
{
  function uuidv4() {
    return 'xxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  var key={
    id: uuidv4(),
    secret: uuidv4()
  }
  res.json(key);
})
//키 발급

router.post('/reg_svc',(req, res, next)=>
{
  
  const info = {
    "id": req.user.id_idx,
    "svc_name": req.body.svc_name,
    "c_id" : req.body.c_id,
    "callback" : req.body.callback,
    "c_secret" : req.body.c_secret,
    "svc_desc" : req.body.svc_desc,
  };

  var sql = 'INSERT INTO service_test(service_name, service_client_id,service_client_secret,service_callback_url,service_text,id_idx) VALUES(?,?,?,?,?,?)';
  var params = [info['svc_name'], info['c_id'], info['c_secret'], info['callback'], info['svc_desc'],info['id']];

  mdbConn.dbInsert(sql, params)
  .then((rows) => {
    console.log(rows);
  })
  .catch((errMsg) => {
    console.log(errMsg);
  });

  res.json(info);
});

// 서비스등록 끝


//서비스 리스트 가져오기
router.get('/svc_list',async function(req,res,next){
  var id= req.user.id_idx;
  var sql = `select * from service_test where id_idx=${id}`;
  var params = req.session.passport.user.id;
  var result = await mdbConn.dbSelectall(sql, params);
  res.json(result);
});


router.post('/svc_list_del',async function(req,res,next){
  var id= req.user.id_idx;
  console.log(req.body);
  var svc_id = req.body.service_id;
  var sql = `delete from service_test where service_id=${svc_id} and id_idx=${id};`;
  var params = [];
  await mdbConn.dbSelect(sql, params)
  .then(() => {
    console.log("success")
    res.redirect('/mypage/reg_svc');
  })
});




module.exports = router;