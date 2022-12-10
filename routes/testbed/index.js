var express = require("express");
var mdbConn = require("../../db_connection/mariaDBConn");
var router = express.Router();
const diagnosis = require("../v1/diagnosis/diagnosis");
const pharmacy = require("../v1/pharmacy/pharmacy");
const specification = require("../v1/specification/specification");
const { isLogIn } = require("../../controller/login");
const { checkTokens } = require("../../passport/abouttoken");
const {YYYYMMDD} = require("../../controller/controller");
/* GET home page. */
router.get("/", isLogIn, checkTokens, function (req, res, next) {
  res.render("test");
});

router.get("/unit_svc", isLogIn, checkTokens, async function (req, res, next) {
  // service idx
  var sql = "SELECT * FROM service_test WHERE id_idx=?";
  params = req.user.id_idx;
  var rows = await mdbConn.dbSelectall(sql, params);
  res.locals.service_select = rows;

  // data idx
  var sql = "SELECT * FROM data_test WHERE id_idx=?";
  params = req.user.id_idx;
  var rows = await mdbConn.dbSelectall(sql, params);
  res.locals.data_select = rows;

  res.render("unit_svc");
});

router.post("/ServiceSelect", function (req, res, next) {
  var data = req.body.data;
  var sql = "SELECT * FROM service_test WHERE service_id=?"; //선택된 서비스의 클라이언트 id와 secret을 가져오기 위한 쿼리
  mdbConn.dbSelect(sql, data).then((rows) => {
    if (rows) {
      res.json({
        clientid: rows.service_client_id,
        clientsecret: rows.service_client_secret,
      });
    } else {
      res.send(false);
    }
  });
});

router.post("/ServerSelect", function (req, res, next) {
  var data = req.body.data;
  var sql = "SELECT * FROM server_management WHERE server_manage_id=?"; //선택된 서비스의 클라이언트 id와 secret을 가져오기 위한 쿼리
  mdbConn.dbSelect(sql, data).then((rows) => {
    if (rows) {
      res.json({
        clientip: rows.server_ip,
        business_right: rows.business_right,
      });
    } else {
      res.send(false);
    }
  });
});

router.post("/selectServer", function (req, res, next) {
  var data = req.body.data;
  req.session.server = data;
  res.json({ url: data });
});
function curlStringProcessing(data){
  var reqHeaders = {};
  var reqBody = {};
  var key = '';
  var val = '';
  var hord = '-H';
  for(var i=3; i < data['curl'].length; i++){
    if (data['curl'][i] == '-H' || data['curl'][i] == '-d' ){
      if(key == '' || val == '')
        continue;
      if(hord == '-H')
        reqHeaders[key] = val;
      else
        reqBody[key] = val;
        key = val = '';

      hord = data['curl'][i] ;
    }
    else if(i+1 == data['curl'].length){
      val = data['curl'][i];
      if(hord == '-H')
        reqHeaders[key] = val;
      else
        reqBody[key] = val;
    }
    else{
      if(key == '')
        key = data['curl'][i].split(':')[0];
      else
        val = data['curl'][i];
    }
  }
    data['reqHeaders'] = reqHeaders;
    data['reqBody'] = reqBody;
}
router.post("/unitLogging", function (req, res, next){
  const data = {
    type : req.body.type,
    timestamp : YYYYMMDD(new Date().getTime(),"ORDER"),
    curl: req.body.curl.split(/ |curl|\\|\n|'/ ).filter((elemet) => elemet !== ''),
    resCode: req.body.resCode,
    resBody: req.body.resBody.split(/\n/ ).filter((elemet) => elemet !== '').join("<br>"),
    resHeaders: req.body.resHeaders.split(/  / ).filter((elemet) => elemet !== '')
  }
  data['httpMethod'] = data['curl'][1]
  data['reqUrl'] = data['curl'][2]
  curlStringProcessing(data)
  delete data['curl']
  // 위쪽 Object는 혹시 모를 추가 정보 때문에 그대로 나둠
  // console.log(data)
  if (data['resCode'] == ' Undocumented '){
    data['resCode'] = "Fail"
    data['resBody'] = `
        Possible Resons <br>
      - CORS <br>
      - Network Failure <br>
      - URL scheme must be \"http\" or \"https\" for CORS request <br>
    `
  }
  console.log(data['resCode'])
  var sql = 'INSERT INTO log(type, user,timestamp,reqUrl, reqHeaders, reqBody, resCode,resBody,httpMethod) VALUES(?,?,?,?,?,?,?,?,?)';
  var params = [data['type'], req.session.joinUser['nickname'], data['timestamp'], data['reqUrl'],data['reqHeaders'], data['reqBody'], data['resCode'],data['resBody'], data['httpMethod']];
  mdbConn.dbInsert(sql, params)
  .then((rows) => {
    // console.log(rows);
    res.send(data);
  })
  .catch((err) => {
    console.log(err);
  });
});

router.get("/inte_svc", isLogIn, checkTokens, function (req, res, next) {
  res.render("inte_svc");
});

router.get("/unit_api", isLogIn, checkTokens, async function (req, res, next) {
  var sql = "SELECT * FROM server_management WHERE id_idx=?";
  params = req.user.id_idx;
  var rows = await mdbConn.dbSelectall(sql, params);
  res.locals.server_select = rows;
  res.render("unit_api");
});

router.get("/inte_api", isLogIn, checkTokens, function (req, res, next) {
  res.render("inte_api");
});

router.get("/inte_api_access", isLogIn, checkTokens, function (req, res, next) {
  if ((req.session.code != undefined && req.session.code != null) || req.query.code != null) {
    var code = req.session.code;
    var code_f = [req.query.code, code["org_code"], code["client_id"]];
    console.log(code_f);
    res.locals.CODE = code_f;
    res.render("inte_api_access");
  } else {
    res.redirect("/");
  }
});

router.post("/inte_api_access", isLogIn, checkTokens, function (req, res, next) { //individual.authorization_api
  try{
    var code = {
      "org_code" : req.body.org_code, 
      "client_id" : req.body.client_id, 
      "redirect_uri" : req.body.redirect_uri};
    req.session.code = code;
    res.send(code);
  }
  catch(err){
    res.send(false);
  }
});


// router.post("/inte_api_final", isLogIn, checkTokens, individual.token_api);
router.post("/inte_api_final", isLogIn, checkTokens, function(req,res){
  console.log(req.body)
  const code = {"code": req.body.code,
                "orgCode": req.body.orgCode,
                "id": req.body.id,
                "secret": req.body.secret,
                "callbackUrl" : req.body.redirect_uri
              }

  req.session.code_final = code
  res.send(true);
});


router.get("/inte_api_final", isLogIn, checkTokens, async function (req, res, next) {
  console.log(req.query.token);
  console.log(req.session.code_final);
    if (req.session.code_final != undefined && req.session.code_final != null && req.query.token != undefined) {
      var code_final = req.session.code_final;
      req.session.code_final = null;
      var sql = "SELECT * FROM server_management WHERE id_idx=?";
      params = req.user.id_idx;
      var rows = await mdbConn.dbSelectall(sql, params);
      res.locals.C_FINAL = code_final;
      res.locals.server_select = rows;
      res.locals.token = req.query.token
      res.render("inte_api_final");
    } else {
      res.redirect("/");
    }

  }
);

router.post("/moneylist", isLogIn, checkTokens, function (req, res, next) {
  res.send(
    "<script>alert('인증에 성공하였습니다.');location.href='/testbed/moneylist';</" +
      "script>"
  );
});

router.get("/moneylist", isLogIn, checkTokens, function (req, res, next) {
  res.render("moneylist");
});

router.get("/popup_api_select", isLogIn,checkTokens, function (req, res, next) {
  res.render("popup_api_select", {select : req.query.id});
});


router.post("/DataSelect", isLogIn, checkTokens,
  async function (req, res, next) {
    var data = req.body.data;
    var sql = "SELECT * FROM data_test WHERE data_id=?";

    mdbConn.dbSelect(sql, data).then((rows) => {
      if (rows) {
        res.json({ data_json: rows.data_json });
      } else {
        res.send(false);
      }
    });
  }
);

//통합 서버 테스트 첫번째
router.get("/inte_api_final_request", function(req, res, next){
  res.render("inte_api_final_request")
});

//통합 서버 테스트 첫번째
router.post("/inte_api_final_request", function(req, res, next){
  var select = req.body.select
  var method;
  console.log(select)
  if(select == "명세서 내역 목록 조회") {
    var row = `{\n    "x-api-tran-id": "입력해주세요",\n    "x-api-type": "false",\n    "org_code": "${req.body.orgcode}",\n    "search_timestamp": "0",\n    "access_token": "${req.body.Access_token}"\n}` //${opener.$('#Access_token').val()}
    method = "[GET]"
  } else if(select == "명세서 내역 조회") {
    var row = `{\n    "x-api-tran-id": "입력해주세요",\n    "x-api-type": "false",\n    "org_code": "${req.body.orgcode}",\n    "spec_id": "입력해주세요",\n    "search_timestamp": "0",\n    "access_token": "${req.body.Access_token}"\n}` //${opener.$('#Access_token').val()}
    method = "[POST]"
  } else if(select == "전송요구내역 조회") {
    var row = `{\n    "x-api-tran-id": "입력해주세요",\n    "x-api-type": "false",\n    "org_code": "${req.body.orgcode}",\n    "access_token": "${req.body.Access_token}"\n}` //${opener.$('#Access_token').val()}
    method = "[GET]"
  } else if(select == "진료내역 목록 조회"){
    var row = `{\n    "x-api-tran-id": "입력해주세요",\n    "x-api-type": "false",\n    "org_code": "${req.body.orgcode}",\n    "search_timestamp": "0",\n    "access_token": "${req.body.Access_token}"\n}` //${opener.$('#Access_token').val()}
    method = "[GET]"
  } else if(select == "진료내역 조회") {
    var row = `{\n    "x-api-tran-id": "입력해주세요",\n    "x-api-type": "false",\n    "org_code": "${req.body.orgcode}",\n    "spec_id": "입력해주세요",\n    "line_no": "입력해주세요",\n    "search_timestamp": "0",\n    "access_token": "${req.body.Access_token}"\n}` //${opener.$('#Access_token').val()}
    method = "[POST]"
  } else if(select == "처방전교부목록 조회") {
    var row = `{\n    "x-api-tran-id": "입력해주세요",\n    "x-api-type": "false",\n    "org_code": "${req.body.orgcode}",\n    "search_timestamp": "0",\n    "access_token": "${req.body.Access_token}"\n}` //${opener.$('#Access_token').val()}
    method = "[GET]"
  } else if(select == "처방전교부내역 조회") {
    var row = `{\n    "x-api-tran-id": "입력해주세요",\n    "x-api-type": "false",\n    "org_code": "${req.body.orgcode}",\n    "spec_id": "입력해주세요",\n    "pres_certify_no": "입력해주세요",\n    "search_timestamp": "0",\n    "access_token": "${req.body.Access_token}"\n}` //${opener.$('#Access_token').val()}
    method = "[POST]"
  } else if(select == "의료기관약제내역목록 조회") {
    var row = `{\n    "x-api-tran-id": "입력해주세요",\n    "x-api-type": "false",\n    "org_code": "${req.body.orgcode}",\n    "search_timestamp": "0",\n    "access_token": "${req.body.Access_token}"\n}` //${opener.$('#Access_token').val()}
    method = "[GET]"
  } else if(select == "의료기관약제내역 조회") {
    var row = `{\n    "x-api-tran-id": "입력해주세요",\n    "x-api-type": "false",\n    "org_code": "${req.body.orgcode}",\n    "spec_id": "입력해주세요",\n    "search_timestamp": "0",\n    "access_token": "${req.body.Access_token}"\n}` //${opener.$('#Access_token').val()}
    method = "[POST]"
  } 
  req.session.select = select;
  res.send({"row" : row, "api" : method+" "+select})
});

//통합 서버 테스트 두번째
router.get("/inte_api_final_response", function(req, res, next){
  res.render("inte_api_final_response")
});

router.get("/api_response", function(req, res, next){
  select = req.session.select
  req.session.select = null
  if(select == "명세서 내역 목록 조회") {
    specification.lists(req, res)
  } else if(select == "명세서 내역 조회") {
    specification.specifics(req, res)
  } else if(select == "전송요구내역 조회") {
    specification.consents(req, res)
  } else if(select == "진료내역 목록 조회"){
    diagnosis.lists(req, res)
  } else if(select == "진료내역 조회") {
    diagnosis.histories(req, res)
  } else if(select == "처방전교부목록 조회") {
    diagnosis.presciptions(req, res)
  } else if(select == "처방전교부내역 조회") {
    diagnosis.certifications(req, res)
  } else if(select == "의료기관약제내역목록 조회") {
    pharmacy.lists(req, res)
  } else if(select == "의료기관약제내역 조회") {
    pharmacy.histories(req, res)
  }
});

router.get("/inte_test", function(req, res, next){
  res.render("inte_api_final_response")
});


module.exports = router;
