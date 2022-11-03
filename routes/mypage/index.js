var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();
const {body} = require('express-validator');
const bcrypt = require('bcrypt');
const { myLogIn,isLogIn, isSNSLogIn,validatorErrorChecker}= require('../../controller/login')
const { checkTokens, generateuuidv4 } = require("../../passport/abouttoken");

/* GET home page. */
router.get('/editcheck', isLogIn, isSNSLogIn, checkTokens, function(req, res, next) {
  res.render('editcheck');
});

router.post('/editcheck', async function(req, res, next){
  var sql = "SELECT * FROM Customers_Enterprise WHERE e_customer_id=?";
  var params = req.session.passport.user.id;
  var result = await mdbConn.dbSelect(sql, params);
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
    .catch((err) => {
      console.log(err);
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

router.get('/reg_svc',myLogIn, function(req, res, next) {
  res.render('reg_svc');
});

router.get('/reg_svr',myLogIn, function(req, res, next) {
  res.render('reg_svr');
});

router.get('/reg_data',myLogIn, function(req, res, next) {
  res.render('reg_data');
});

router.get('/reg_isv', isLogIn, checkTokens, function(req, res, next) {
  res.render('reg_isv');
});


router.get('/add_svr',myLogIn, function(req, res, next) {
  res.render('add_svr');
});

router.get('/add_svc',myLogIn, function(req, res, next) {
  res.render('add_svc');
});

router.get('/add_data',myLogIn, function(req, res, next) {
  res.render('add_data');
});

// 데시보드
router.get('/dashboard', myLogIn, function(req, res, next) {
  res.render('dashboard');
});

//마이데이터 서비스 테스트 관리
router.get('/reg_svc_no', isLogIn, checkTokens, mdbConn.dbCheck);
router.get('/reg_svc_list', isLogIn, checkTokens, mdbConn.dbCheck);

//테스트 데이터 관리
router.get('/editdata_list', isLogIn, checkTokens, mdbConn.dataCheck);
router.get('/editdata_no', isLogIn, checkTokens, mdbConn.dataCheck);

//서버 등록 관리
router.get('/reg_svr_no', isLogIn, checkTokens, mdbConn.svrCheck);
router.get('/reg_svr_list', isLogIn, checkTokens, mdbConn.svrCheck);

//연동 테스트 관리
router.get('/editinte', isLogIn, checkTokens, mdbConn.dbCheck_inter);
router.get('/editinte_no', isLogIn, checkTokens, mdbConn.dbCheck_inter);


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
    res.redirect('/mypage/editdata_list#!reg_svc')
  })
  .catch((err) => {
    res.send(
      "<script>alert('저장 실패!!');location.href='/mypage/editdata_list#!reg_list';</" +
      "script>"
    );
  });
});

// 서비스등록 끝

//리스트 가져오기
async function getList(req, res, sql){
  try{
    var params = req.user.id_idx;
    var result = await mdbConn.dbSelectall(sql, params);
    res.json(result);
    }
    catch{
      console.log("login error svc_list");
    }
}
//서비스 리스트 가져오기

router.get('/svc_list',(req,res) => {
  getList(req,res,'select * from service_test where id_idx=?');
});

//서비스 리스트 지우기
router.post('/svc_list_del',async function(req,res,next){
  var id= req.user.id_idx;
  var svc_id = req.body.service_id;
  var sql = 'delete from service_test where service_id=? and id_idx=?';
  var params = [id, svc_id];
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
router.get('/data_list',(req,res) => {
  getList(req,res,'select * from data_test where id_idx=?')
});

//테스트데이터 지우기
router.post('/data_list_del',async function(req,res,next){
  var id= req.user.id_idx;
  console.log(req.body);
  var data_id = req.body.data_id;
  var sql = 'delete from data_test where data_id=? and id_idx=?';
  var params = [id, data_id];
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
router.get('/svr_list',(req,res)=> {
  getList(req,res,'select * from server_management where id_idx=?');
});

//테스트데이터 지우기
router.post('/svr_list_del',async function(req,res,next){
  console.log(req.body);
  var data_id = req.body.server_manage_id;
  var sql = 'delete from server_management where server_manage_id=?';
  var params = [data_id];
  await mdbConn.dbSelect(sql, params)
  .then(() => {
    res.redirect('/mypage/editdata_list#!reg_data');
  })
});

//연동 테스트 서버 등록 페이지 이동
router.get("/addinte_server", isLogIn, checkTokens, async function(req, res, next){
  var sql = "SELECT * FROM server_management WHERE id_idx=?";
  params = req.user.id_idx;
  var rows = await mdbConn.dbSelectall(sql, params);
  
  res.locals.server_select = rows;
  res.render("addinte_server"); 
});

//연동서버리스트 가져오기
router.get('/isv_list', async function(req,res,next){
  var sql = 'select inter_server.request_count, inter_server.interserver_id, server_management.server_name, server_management.server_ip, server_management.business_right from inter_server join server_management on inter_server.server_manage_id = server_management.server_manage_id where inter_server.id_idx=?';
  var params = req.user.id_idx;
  var result = await mdbConn.dbSelectall(sql, params);
  res.json(result);
});

//연동 테스트 서버 등록 요청
router.post("/addinte_server", isLogIn, checkTokens, async function(req, res, next){
  var data = req.body.NUMBER;
  console.log(data);
  var sql = "SELECT * FROM server_management WHERE server_manage_id=?";  //선택된 서비스의 클라이언트 id와 secret을 가져오기 위한 쿼리
  mdbConn.dbSelect(sql, data)
  .then((rows) => {
    if(rows){
      params = [rows.id_idx, data];
      var sql = 'INSERT INTO inter_server(id_idx, server_manage_id, request_count) VALUES(?,?,0)';
      mdbConn.dbInsert(sql, params)
      .then((rows) => {
        res.send(true);
      })
      .catch((err) => {
        res.send(false);
      });
    }else {
      res.send(false);
    }
  });
});


// 대시보드 내용 추가
router.get('/dashboradServiceList',(req,res)=> {
  getList(req,res,'select * from service_test where id_idx=?');
});
router.get('/dashboradServerList', (req,res)=> {
  getList(req,res,'select * from server_management where id_idx=?');
});
router.get('/dashboraddataList', (req,res)=> {
  getList(req,res,'select * from data_test where id_idx=?')
});
router.get('/dashboardlog',(req,res) => {
  getList(req,res,'select * from log;');
});

router.get('/countServiceUnitLog',async (req,res) => {
  var sql = 'select count(*) from log where type = ?;'
  var params = "서비스 <br> 단위테스트";
  var result = await mdbConn.dbSelect(sql, params);
  var data = {}
  data['service_unit'] = result['count(*)'].toString();
  res.json(data);
});
router.post('/countServiceInteLog',async (req,res) => {
  var sql = 'select count(*) from log where type = ?;'
  var params = "서비스 <br> 통합테스트";
  var result = await mdbConn.dbSelect(sql, params);
  var data = {}
  data['service_inte'] =result['count(*)'].toString();
  data['service_unit'] = req.body['service_unit']
  res.json(data);
});
router.post('/countserverUnitLog',async (req,res) => {
  var sql = 'select count(*) from log where type = ?;'
  var params = "서버 <br> 단위테스트";
  var result = await mdbConn.dbSelect(sql, params);
  var data = {}
  data['server_unit'] =result['count(*)'].toString();
  data['service_unit'] = req.body['service_unit']
  data['service_inte'] = req.body['service_inte']
  res.json(data);
});
router.post('/countServerInteLog',async (req,res) => {
  var sql = 'select count(*) from log where type = ?;'
  var params = "서버 <br> 통합테스트";
  var result = await mdbConn.dbSelect(sql, params);
  var data = {}
  data['server_inte'] =result['count(*)'].toString();  
  data['service_unit'] = req.body['service_unit']
  data['service_inte'] = req.body['service_inte']
  data['server_unit'] = req.body['server_unit']
  res.json(data);
});
router.get('/countDatePerTry', async (req, res) => {
  var sql = 'select * from log'
  var params = [];
  var result = await mdbConn.dbSelectall(sql, params);
  res.json(result);
})
module.exports = router;

