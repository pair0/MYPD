var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();
const {body} = require('express-validator');
const {validatorErrorChecker} = require('../users/valcheck');
const bcrypt = require('bcrypt');
const { isLogIn }= require('../auth/auth')
const { checkTokens } = require("../../passport/abouttoken");

/* GET home page. */
router.get('/editcheck', isLogIn, checkTokens, function(req, res, next) {
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

router.get('/edit', function(req, res, next) {
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

router.get('/edit', isLogIn, checkTokens, function(req, res, next) {
  res.render('edit');
});

router.get('/editdata', isLogIn, checkTokens, function(req, res, next) {
  res.render('editdata');
});

router.get('/editmty', isLogIn, checkTokens, function(req, res, next) {
  res.render('editmty');
});

/* 테스트 개발 페이지 (나중에 삭제) */
router.get('/tmp', isLogIn, checkTokens, function(req, res, next) {
  res.render('tmp');
});

router.get('/reg_svc', isLogIn, checkTokens, function(req, res, next) {
  res.render('reg_svc');
});

router.get('/reg_svc_no', isLogIn, checkTokens, function(req, res, next) {
  res.render('reg_svc_no');
});

module.exports = router;