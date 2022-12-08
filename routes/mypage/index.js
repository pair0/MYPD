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
      if (!rows) res.send("<script>alert('잘못된 접근입니다.');location.href='/main';</" + "script>");
      else res.send("<script>alert('회원 정보 수정이 완료되었습니다.!!');location.href='/main';</" + "script>");
    })
    .catch((err) => {
      res.send("<script>alert('잘못된 접근입니다.');location.href='/main';</" + "script>");
    });
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

router.get('/reg_svc', myLogIn, function(req, res, next) {
  res.render('reg_svc');
});

router.get('/reg_svr', myLogIn, function(req, res, next) {
  res.render('reg_svr');
});

router.get('/reg_data', myLogIn, function(req, res, next) {
  res.render('reg_data');
});

// 데시보드
router.get('/dashboard', myLogIn, function(req, res, next) {
  res.render('dashboard');
});

router.get('/reg_isv', myLogIn, function(req, res, next) {
  res.render('reg_isv');
});

//연동 서비스 테스트
router.get('/reg_isc', myLogIn, function(req, res, next) {
  res.render('reg_isc');
});

//연동 서비스 테스트 서버 검색 결과
router.get('/reg_server_select', myLogIn, function(req, res, next) {
  res.render('reg_server_select');
});

router.get('/add_svr',myLogIn, function(req, res, next) {
  res.render('add_svr');
});

router.get('/add_svc',myLogIn, function(req, res, next) {
  res.render('add_svc');
});

router.get('/editdata_list', isLogIn, checkTokens, function(req, res, next){
  res.render('editdata_list');
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
    if (!rows) res.send("<script>alert('저장 실패!!');location.href='/mypage/editdata_list#!reg_list';</" + "script>");
    else res.redirect('/mypage/editdata_list#!reg_svc');
  })
  .catch((err) => {
    res.send("<script>alert('저장 실패!!');location.href='/mypage/editdata_list#!reg_list';</" + "script>");
  });
});

// 서비스등록 끝

//리스트 가져오기
async function getList(req, res, sql, params){
  try{
    var result = await mdbConn.dbSelectall(sql, params);
    res.json(result);
    }
    catch{
      console.log("login error svc_list");
    }
}

//서비스 리스트 가져오기
router.get('/svc_list',(req,res) => {
  getList(req,res,'select * from service_test where id_idx=?',[req.user.id_idx]);
});

//서비스 리스트 지우기
router.post('/svc_list_del', async function(req,res,next){
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
    if(!rows) res.send("<script>alert('저장 실패!!');location.href='/mypage/editdata_list#!reg_data';</" + "script>");
    else res.redirect('/mypage/editdata_list#!reg_data');
  }).catch((err) => {
    res.send("<script>alert('저장 실패!!');location.href='/mypage/editdata_list#!reg_data';</" + "script>");
  });
});

//테스트데이터 리스트 가져오기
router.get('/data_list',(req,res) => {
  getList(req,res,'select * from data_test where id_idx=?',[req.user.id_idx])
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
    if(!rows) res.send("<script>alert('잘못된 접근입니다.');location.href='/mypage/editdata_list#!reg_svr';</" + "script>");
    else  res.redirect('/mypage/editdata_list#!reg_svrt');
  }).catch((err) => {
    res.send("<script>alert('잘못된 접근입니다.');location.href='/mypage/editdata_list#!reg_svr';</" + "script>");
  });
});

//서버리스트 가져오기
router.get('/svr_list',(req,res)=> {
  getList(req,res,'select * from server_management where id_idx=?',[req.user.id_idx]);
});

//마이페이지 지우기 지우기
router.post('/list_del',async function(req,res,next){
  var number = req.body.number;
  var data_id = req.body.id;
  if (number == 1) var sql = 'delete from service_test where service_id=?';
  else if(number == 2) var sql = 'delete from data_test where data_id=?';
  else if(number == 3) var sql = 'delete from server_management where server_manage_id=?';
  else if(number == 4) var sql = 'delete from inter_server where interserver_id=?';
  else if(number == 5) var sql = 'delete from service_approve where service_approve_id=?';
  else if(number == 6) var sql = 'delete from service_request where service_request_id=?';
  else if(number == 7) var sql = 'delete from service_reject where service_reject_id=?';
  var params = [data_id];
  await mdbConn.dbInsert(sql, params)
  .then((rows) => {
    if (!rows) res.send("연동테스트 서버에 등록된 서버 해제 후 다시 진행해 주세요.");
    else res.send(number);
  }).catch((err) => {
    res.send("잘못된 접근입니다.");
  });
});

//연동 테스트 서버 등록 페이지 이동
router.get("/addinte_server", myLogIn, async function(req, res, next){
  var sql = "SELECT * FROM server_management WHERE id_idx=?";
  params = req.user.id_idx;
  var rows = await mdbConn.dbSelectall(sql, params);
  
  res.locals.server_select = rows;
  res.render("addinte_server"); 
});

//연동서버리스트 가져오기
router.get('/isv_list', myLogIn, async function(req,res,next){
  var sql = 'select i.request_count, i.interserver_id, m.server_manage_id, m.server_name, m.server_ip, m.business_right from inter_server i join server_management m on i.server_manage_id = m.server_manage_id where i.id_idx=?';
  var params = req.user.id_idx;
  var result = await mdbConn.dbSelectall(sql, params);
  res.json(result);
});

//연동 테스트 서버 등록 요청
router.post("/addinte_server", isLogIn, checkTokens, async function(req, res, next){
  var data = req.body.NUMBER;
  console.log(data);
  var sql = "SELECT * FROM server_management WHERE server_manage_id=?"; 
  mdbConn.dbSelect(sql, data)
  .then((rows) => {
    if(rows){
      var id_idx = rows.id_idx
      var sql = "SELECT * FROM inter_server WHERE server_manage_id=?"
      mdbConn.dbSelect(sql, data)
      .then((rows) => {
        if(rows){
          res.send("이미 등록되어 있는 서버입니다.")
        }
        else{
          params = [id_idx, data];
          var sql = 'INSERT INTO inter_server(id_idx, server_manage_id, request_count) VALUES(?,?,0)';
          mdbConn.dbInsert(sql, params)
          .then((rows) => {
            if (!rows) res.send("잘못된 접근입니다.");
            else res.send(true);
          })
          .catch((err) => {
            res.send("잘못된 접근입니다.");
          }); 
        }
      })
      .catch((err) => {
        res.send("잘못된 접근입니다.");
      });
    }else {
      res.send("잘못된 접근입니다.");
    }
  })
  .catch((err) => {
    res.send("잘못된 접근입니다.");
  });
});

//연동 테스트 서버 디테일
router.get('/isv_detail', myLogIn, async function(req, res, next) {
  var sql = 'SELECT server_management.*, inter_server.interserver_id FROM inter_server JOIN server_management ON inter_server.server_manage_id = server_management.server_manage_id WHERE inter_server.interserver_id = ?';
  var params = req.query.id;
  var raw = await mdbConn.dbSelect(sql, params);
  var sql = 'select s.*, c.e_name from inter_server i, service_test s, service_request r, Customers_Enterprise c where i.interserver_id = ? AND i.server_manage_id = r.server_manage_id AND r.service_id = s.service_id AND c.id_idx = s.id_idx';
  var row = await mdbConn.dbSelectall(sql, params);
  res.locals.row = raw;
  res.locals.raw = row;
  res.render('isv_detail');
});

//연동 서버 테스트 연동 승인
router.post('/approve', isLogIn, checkTokens, async function(req, res, next){
  var sql = 'INSERT INTO service_approve (id_idx, server_manage_id, service_id) VALUES (?,?,?)';
  params = [req.user.id_idx, req.body.id, req.body.sid];
  var raw = await mdbConn.dbInsert(sql, params);
  if(raw){
    sql = 'delete from service_request where id_idx=? AND server_manage_id = ? AND service_id = ?';
    mdbConn.dbInsert(sql, params)
    .then((rows) => {
      if(!rows) res.send(false);
      else {
        sql = 'UPDATE inter_server SET request_count = request_count-1 WHERE server_manage_id = ?'
        params = req.body.id;
        mdbConn.dbInsert(sql, params)
        .then(() => {
          if(!rows) res.send(false);
          else res.send(true);
        }).catch((err) => {
          res.send(false);
        });
      }
    })
    .catch(() => {
      res.send(false);
    }); 
  } else res.send(false);
});

//연동 서버 테스트 연동 반려
router.post('/reject', isLogIn, checkTokens, async function(req, res, next){
  var sql = 'INSERT INTO service_reject (id_idx, server_manage_id, service_id) VALUES (?,?,?)';
  params = [req.user.id_idx, req.body.id, req.body.sid];
  var raw = await mdbConn.dbInsert(sql, params);
  if(raw){
    sql = 'delete from service_request where id_idx=? AND server_manage_id = ? AND service_id = ?';
    mdbConn.dbInsert(sql, params)
    .then((rows) => {
      if(!rows) res.send(false);
      else {
        sql = 'UPDATE inter_server SET request_count = request_count-1 WHERE server_manage_id = ?'
        params = req.body.id;
        mdbConn.dbInsert(sql, params)
        .then(() => {
          if(!rows) res.send(false);
          else res.send(true);
        }).catch((err) => {
          res.send(false);
        });
      }
    })
    .catch(() => {
      res.send(false);
    }); 
  } else res.send(false);
});

////연동된 서비스 목록 보기
router.get('/inter_service_index', function(req, res, next){
  var sql = 'SELECT st.*, c.e_name FROM service_approve ap, service_test st, Customers_Enterprise c where ap.service_id = st.service_id AND c.id_idx = st.id_idx AND ap.server_manage_id = ?'
  var params = req.query.id;
  mdbConn.dbSelectall(sql, params)
  .then((row) => {
    if(row != false){
      res.locals.row = row;
      res.render('inter_service_index')
    } else res.render('error')
  }).catch((err) => {
    res.render('error')
  })
})

//연동 서비스 테스트 추가
router.get('/addinte_service_1', myLogIn, async function(req, res, next){
  res.render('addinte_service_1')
});

//연동 서비스 리스트 가져오기
router.get('/isc_list', myLogIn, async function(req,res,next){
  var sql = 'select m.*, a.service_approve_id, t.service_name from service_approve a, server_management m, service_test t where a.id_idx = ? AND a.server_manage_id = m.server_manage_id AND t.service_id = a.service_id'
  var params = req.user.id_idx;
  var result = await mdbConn.dbSelectall(sql, params);
  res.json(result);
});

//연동 서비스 request 리스트 가져오기
router.get('/isc_list_request', myLogIn, async function(req,res,next){
  var sql = 'select m.*, a.service_request_id, t.service_name from service_request a, server_management m, service_test t where a.id_idx = ? AND a.server_manage_id = m.server_manage_id AND t.service_id = a.service_id'
  var params = req.user.id_idx;
  var result = await mdbConn.dbSelectall(sql, params);
  res.json(result);
});

//연동 서비스 reject 리스트 가져오기
router.get('/isc_list_reject', myLogIn, async function(req,res,next){
  var sql = 'select m.*, a.service_reject_id, t.service_name from service_reject a, server_management m, service_test t where a.id_idx = ? AND a.server_manage_id = m.server_manage_id AND t.service_id = a.service_id'
  var params = req.user.id_idx;
  var result = await mdbConn.dbSelectall(sql, params);
  res.json(result);
});

//연동 서비스 테스트 서버 검색
router.post('/select_server', myLogIn, function(req, res, next){
  var sql = 'select i.interserver_id, m.*, c.e_name, c.e_address from inter_server i, server_management m, Customers_Enterprise c where i.server_manage_id = m.server_manage_id AND m.business_right=? AND c.id_idx = m.id_idx AND c.e_name=?'
  var params = [req.body.select_type, req.body.find_server];
  mdbConn.dbSelectall(sql, params)
  .then((result) => {
    if (result[0] != undefined) {
      res.send(result);
    } else res.send(false);
  }).catch((err) => {
    res.send(false);
  })
});

//연동 서비스 테스트 서버 검색 디테일
router.get('/isc_detail', myLogIn, function(req, res, next) {
  var sql = 'select m.*, c.e_name, c.e_address from server_management m, Customers_Enterprise c where m.server_manage_id=? AND c.id_idx=?'
  var params = [req.query.id, req.query.c_id];
  mdbConn.dbSelect(sql, params)
  .then((row) => {
    res.locals.raw = row;
    res.render('isc_detail');
  }).catch((err) => {
    res.send(`<script>alert('잘못된 접근입니다.');location.replace("/main")</script>`);
  });
});

//연동 서버 테스트 연동 요청
router.get('/isc_approve', myLogIn, function(req, res, next){
  var sql = 'select inter_server.interserver_id, inter_server.server_manage_id, server_management.server_name, server_management.server_ip, server_management.business_right, server_management.server_explain from inter_server join server_management on inter_server.server_manage_id = server_management.server_manage_id where inter_server.server_manage_id=?'
  var params = req.query.id;
  mdbConn.dbSelect(sql, params)
  .then((row) => {
    sql = 'select * from service_test where id_idx=?';
    params = req.user.id_idx;
    mdbConn.dbSelectall(sql, params)
    .then((raw) => {
      res.locals.raw = row;
      res.locals.row = raw;
      res.render('isc_approve');
    }).catch((err) => {
      res.send(`<script>alert('잘못된 접근입니다.');location.replace("/main")</script>`);
    });
  }).catch((err) => {
    res.send(`<script>alert('잘못된 접근입니다.');location.replace("/main")</script>`);
  });
});

//연동 서버 테스트 연동 요청 - DB 추가
router.post('/isc_approve', isLogIn, checkTokens, async function(req, res, next){
  var sql = 'select * from service_request where server_manage_id=? AND service_id=?';
  var params = [req.body.serverI, req.body.serviceI]
  var result = await mdbConn.dbSelect(sql, params)
  sql = 'select * from service_approve where server_manage_id=? AND service_id=?';
  var result1 = await mdbConn.dbSelect(sql, params)
  
  if(result == undefined && result1 == undefined){
    var sql = 'INSERT INTO service_request(id_idx, server_manage_id, service_id, service_text) values (?,?,?,?)'
    var params = [req.user.id_idx, req.body.serverI, req.body.serviceI, req.body.serviceT];
    mdbConn.dbInsert(sql, params)
    .then((row) => {
      if (!row) res.send(`<script>alert('잘못된 접근입니다.');location.replace("/main")</script>`);
      else {
        sql = 'UPDATE inter_server SET request_count=request_count+1 WHERE server_manage_id = ?'
        params = req.body.serverI;
        mdbConn.dbInsert(sql, params)
        .then(() => {
          if (!row) res.send(`<script>alert('잘못된 접근입니다.');location.replace("/main")</script>`);
          else res.send(`<script>alert('연동 요청이 완료되었습니다.');location.replace("/mypage/editdata_list#!isc")</script>`);
        }).catch((err) => {
          res.send(`<script>alert('잘못된 접근입니다.');location.replace("/main")</script>`);
        });
      }
    }).catch((err) => {
      res.send(`<script>alert('잘못된 접근입니다.');location.replace("/main")</script>`);
    });
  }
  else{
    res.send(`<script>alert('이미 연동 신청한 서버입니다.');location.replace("/main")</script>`);
  }
  
});

// 대시보드 내용 추가
router.get('/dashboradServiceList',(req,res)=> {
  // getList(req,res,'select * from service_test where id_idx=? AND user= ?;', [req.user.id_idx , req.session.joinUser['nickname']]);
  getList(req,res,'select * from service_test where id_idx=?;', [req.user.id_idx]);

});
router.get('/dashboradServerList', (req,res)=> {
  getList(req,res,'select * from server_management where id_idx=?',[req.user.id_idx ]);
  // getList(req,res,'select * from server_management where id_idx=? AND user= ?;',[req.user.id_idx , req.session.joinUser['nickname']]);

});
router.get('/dashboraddataList', (req,res)=> {
  getList(req,res,'select * from data_test where id_idx=?', [req.user.id_idx ])
  // getList(req,res,'select * from data_test where id_idx=? AND user = ?', [req.user.id_idx , req.session.joinUser['nickname']])
  
});
router.get('/dashboardlog',(req,res) => {
  getList(req,res,'select * from log WHERE user= ?;', [req.session.joinUser['nickname']]);
});

router.get('/countServiceUnitLog',async (req,res) => {
  var sql = 'select count(*) from log where type = ? AND user= ?;'
  var params = ["서비스 <br> 단위테스트", req.session.joinUser['nickname']];
  var result = await mdbConn.dbSelect(sql, params);
  var data = {}
  data['service_unit'] = result['count(*)'].toString();
  res.json(data);
});
router.post('/countServiceInteLog',async (req,res) => {
  var sql = 'select count(*) from log where type = ? AND user= ?;'
  var params = ["서비스 <br> 통합테스트", req.session.joinUser['nickname']];
  var result = await mdbConn.dbSelect(sql, params);
  var data = {}
  data['service_inte'] =result['count(*)'].toString();
  data['service_unit'] = req.body['service_unit']
  res.json(data);
});
router.post('/countserverUnitLog',async (req,res) => {
  var sql = 'select count(*) from log where type = ? AND user= ?;'
  var params = ["서버 <br> 단위테스트", req.session.joinUser['nickname']];
  var result = await mdbConn.dbSelect(sql, params);
  var data = {}
  data['server_unit'] =result['count(*)'].toString();
  data['service_unit'] = req.body['service_unit']
  data['service_inte'] = req.body['service_inte']
  res.json(data);
});
router.post('/countServerInteLog',async (req,res) => {
  var sql = 'select count(*) from log where type = ? AND user= ?;'
  var params = ["서버 <br> 통합테스트", req.session.joinUser['nickname']];
  var result = await mdbConn.dbSelect(sql, params);
  var data = {}
  data['server_inte'] =result['count(*)'].toString();  
  data['service_unit'] = req.body['service_unit']
  data['service_inte'] = req.body['service_inte']
  data['server_unit'] = req.body['server_unit']
  res.json(data);
});
router.get('/countDatePerTry', async (req, res) => {
  var sql = 'select * from log WHERE user = ?'
  var params = [req.session.joinUser['nickname']];
  var result = await mdbConn.dbSelectall(sql, params);
  res.json(result);
})
module.exports = router;

