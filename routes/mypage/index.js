var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();
const {body} = require('express-validator');
const bcrypt = require('bcrypt');
const { isLogIn, isSNSLogIn,validatorErrorChecker}= require('../../controller/login')
const { checkTokens, generateuuidv4 } = require("../../passport/abouttoken");

/* GET home page. */
router.get('/editcheck', isLogIn, isSNSLogIn, checkTokens, function(req, res, next) {
  res.render('editcheck');
});

router.post('/editcheck', async function(req, res, next){
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
  var sql = "SELECT enterprise_number FROM Customers_Enterprise WHERE id_idx=?";
  params = req.user.id_idx;
  mdbConn.dbSelect(sql, params)
  .then((rows) => {
    if(rows){
      res.locals.user_number = rows.enterprise_number;
      res.render('editdata');
    }else {
      next();
    } 
  });
 
});

router.get('/editmty', isLogIn, checkTokens, function(req, res, next) {
  res.render('editmty');
});


router.get('/reg_svc', isLogIn, checkTokens, function(req, res, next) {
  res.render('reg_svc');
});

router.get('/reg_svr', isLogIn, checkTokens, function(req, res, next) {
  res.render('reg_svr');
});


router.get('/reg_svr_list', isLogIn, checkTokens, mdbConn.svrCheck, function(req, res, next) {
  res.render('reg_svr_list');
});


router.get('/reg_svc_list', isLogIn, checkTokens, mdbConn.dbCheck, function(req, res, next) {
  res.render('reg_svc_list');
});

router.get('/reg_svc_no', isLogIn, checkTokens, function(req, res, next) {
  res.render('reg_svc_no');
});
router.get('/reg_svr_no', isLogIn, checkTokens, function(req, res, next) {
  res.render('reg_svr_no');
});

router.get('/editdata_list', isLogIn, checkTokens, mdbConn.dataCheck, function(req, res, next) {
  res.render('editdata_list');
});

router.get('/editdata_no', isLogIn, checkTokens, function(req, res, next) {
  res.render('editdata_no');
});

//키 발급
router.get('/key_gen',(req,res,next)=>
{
  var key={
    id: generateuuidv4(),
    secret: generateuuidv4()
  }
  res.json(key);
})
//키 발급

router.post('/reg_svc',(req, res, next)=>
{
  // callback URL 추가 시 배열에 push 하는 코드 추가 
  var callback_arr = [];
  callback_arr.push(req.body.callback)
  const info = {
    "id": req.user.id_idx,
    "svc_name": req.body.svc_name,
    "c_id" : req.body.c_id,
    "callback" : JSON.stringify(callback_arr),
    "c_secret" : req.body.c_secret,
    "svc_desc" : req.body.svc_desc,
  };
  var sql = 'INSERT INTO service_test(service_name, service_client_id,service_client_secret,service_callback_url,service_text,id_idx) VALUES(?,?,?,?,?,?)';
  var params = [info['svc_name'], info['c_id'], info['c_secret'], info['callback'], info['svc_desc'],info['id']];

  mdbConn.dbInsert(sql, params)
  .then((rows) => {
    res.redirect('/mypage/reg_svc_list')
  })
  .catch((errMsg) => {
    res.send(
      "<script>alert('저장 실패!!');location.href='/mypage/reg_svc';</" +
      "script>"
    );
  });
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

//서비스 리스트 지우기
router.post('/svc_list_del',async function(req,res,next){
  var id= req.user.id_idx;
  console.log(req.body);
  var svc_id = req.body.service_id;
  var sql = `delete from service_test where service_id=${svc_id} and id_idx=${id};`;
  var params = [];
  await mdbConn.dbSelect(sql, params)
  .then(() => {
    res.redirect('/mypage/reg_svc');
  })
});

//테스트데이터 등록하기

router.post('/editdata',(req, res, next)=>
{
  
  const info = {
    "id": req.user.id_idx,
    "data_name": req.body.data_name,
    "enterprise_code" : req.body.org_code,
    "business_right" : req.body.biz_type,
    "consents" : "false",
    "asset_id" : req.body.assetId,
    "data_api" : req.body.api,
    "data_json" : req.body.testdata,
  };
  var sql = "INSERT INTO data_test(data_name, enterprise_code, business_right,consents, asset_id,data_api,data_json,id_idx) VALUES(?,?,?,?,?,?,?,?)";
  var params = [info['data_name'], info['enterprise_code'], info['business_right'], info['consents'], info['asset_id'], info['data_api'],info['data_json'],info['id']];

  mdbConn.dbInsert(sql, params)
  .then((rows) => {
    res.redirect('/mypage/editdata_list');
  })
});

//테스트데이터 리스트 가져오기
router.get('/data_list',async function(req,res,next){
  var id= req.user.id_idx;
  var sql = `select * from data_test where id_idx=${id}`;
  var params = req.session.passport.user.id;
  var result = await mdbConn.dbSelectall(sql, params);
  res.json(result);
});

//테스트데이터 지우기
router.post('/data_list_del',async function(req,res,next){
  var id= req.user.id_idx;
  console.log(req.body);
  var data_id = req.body.data_id;
  var sql = `delete from data_test where data_id=${data_id} and id_idx=${id};`;
  var params = [];
  await mdbConn.dbSelect(sql, params)
  .then(() => {
    res.redirect('/mypage/editdata_list');
  })
});


//서버 등록하기
router.post('/reg_svr',(req, res, next)=>
{
  console.log(req.body);
  const info = {
    "id": req.user.id_idx,
    "ip": req.body.ip,
    "svr_name" : req.body.svr_name,
    "biz_type" : req.body.biz_type,
    "svr_desc" : req.body.svr_desc
  };
  var sql = "INSERT INTO server_management(server_ip, server_name, business_right, server_explain, id_idx) VALUES(?,?,?,?,?)";
  var params = [info['ip'], info['svr_name'], info['biz_type'], info['svr_desc'], info['id']];

  mdbConn.dbInsert(sql, params)
  .then((rows) => {
    res.redirect('/mypage/reg_svr_list');
  })
});

//서버리스트 가져오기
router.get('/svr_list',async function(req,res,next){
  var id= req.user.id_idx;
  var sql = `select * from server_management where id_idx=${id}`;
  var params = req.session.passport.user.id;
  var result = await mdbConn.dbSelectall(sql, params);
  res.json(result);
});

//테스트데이터 지우기
router.post('/svr_list_del',async function(req,res,next){
  console.log(req.body);
  var data_id = req.body.server_manage_id;
  var sql = `delete from server_management where server_manage_id=${data_id};`;
  var params = [];
  await mdbConn.dbSelect(sql, params)
  .then(() => {
    res.redirect('/mypage/editdata_list');
  })
});

module.exports = router;