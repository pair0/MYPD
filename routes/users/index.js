var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();
const { body } = require('express-validator');
const { generateAccessToken, generateRefreshToken, checkTokens } = require('../../passport/abouttoken')
const { isLogIn, isNotLogIn , validatorErrorChecker} = require('../../controller/login')
const emailsend = require("../../lib/mail");
const bcrypt = require('bcrypt');
require("dotenv").config();

/* Login */
/* 로그인, 로그인 되지 않은 상태에서만 접근 가능하도록 하기 위햐 isNotLogin 함수 정의 후 사용 (auth 폴더 안 auth.js 파일 참고)  */
router.get("/login", isNotLogIn, (req, res, next) => {
  res.render("login");
});

/* 로그인시 accessToken 발급 및 DB에 refresh Token update, 세션 생성 */
router.post("/login", async function (req, res) { //로그인 신청
  // 로그인 후 이전페이지로 돌아기 위한 코드
  if (req.session.return == undefined)
    var returnUrl = '/';
  else
    var returnUrl = req.session.return;
  if (returnUrl == "/mypage/editdata_list") 
    returnUrl = "/mypage/editdata_list#!reg_svc"

  // 로그인 Start
  var sql = "SELECT * FROM Customers_Enterprise WHERE e_customer_id = ? ;"
  var params = [req.body.id.toString()];
  var result = await mdbConn.dbSelect(sql, params);
  if (result == undefined) {
    res.send(`<script>alert('아이디 혹은 패스워드가 잘못되었습니다.');location.replace("/user/login")</script>`);
  }
  else {
    // bcrypt 모듈 사용해 비밀번호 hash 결과가 같은지 check
    bcrypt.compare(req.body.pw, result.e_customer_pw, (err, same) => {
      if (!same) {
        res.send(`<script>alert('아이디 혹은 패스워드가 잘못되었습니다.');location.replace("/user/login")</script>`);
      }
      else {
        const payload = {
          idx : req.body.id_idx
        };
        // access Token 생성 (passport 폴더의 abouttoken 파일 확인)
        const accessToken = generateAccessToken(payload);
        // refresh Token 생성 (passport 폴더의 abouttoken 파일 확인)
        const refreshToken = generateRefreshToken(payload);
        const info = {
          refreshToken: 'Bearer ' + refreshToken,
          accessToken: 'Bearer ' + accessToken,
          e_customer_id: result.e_customer_id
        };
        var sql = "UPDATE Customers_Enterprise SET refresh_token = ?  WHERE e_customer_id = ?"; //회원 DB에 refresh 토큰 저장
        var params = [info['refreshToken'], info['e_customer_id']];
        mdbConn.dbInsert(sql, params) // DB에 refresh Token Update
          .then((rows) => { 
            if(!rows) res.send("<script>alert('잘못된 접근입니다.');location.href='/';</" + "script>");
            else {
              // Session 정보 생성
              req.session.joinUser = {
                nickname: result.nickname,
                snsID: result.snsID,
                refreshToken: 'Bearer ' + refreshToken
              };
              // Session 저장 및 passport 모듈 내장함수인 logIn 사용해 로그인 완료 후 main 페이지로 redirect
              req.session.save(() => {
                return req.logIn(info, (error) => {
                  if (error) {
                    return console.error(error);
                  }
                  res.redirect(returnUrl);
                });
              });
            }
          })
          .catch((errMsg) => {
            res.send("<script>alert('잘못된 접근입니다.');location.href='/';</" + "script>");
          });
      }
    })
  }
});

/* 로그아웃 router */
router.get('/logout', async function (req, res) {
  var session = req.session;
  try {
    // kakao 로그인은 로그아웃 방식이 따로 존재하기 때문에 세션 정보의 snsID가 kakao일 경우 auth폴더 안에 index.js에 정의해놓은 kakao logut 라우터 실행
    if (session.joinUser.snsID === 'kakao') {
      return res.redirect('/auth/kakao/logout')
    }
    // kakao 외의 로그인 일 경우 세션을 지우고 passport모듈 내장 함수인 logout 기능을 이용, 그리고 마지막에 세션 쿠키를 지워주면서 완전히 로그아웃
    else {
      req.session.destroy(function (err) {
        if (err)
          console.log(err)
        else {
          req.logout(function (err) {
            if (err) { return next(err); }
          });
          res.clearCookie('connect.sid');
          res.redirect('/');
        }
      })
    }
  }
  catch (error) {
    console.log(error)
  }
});

/* 회원가입 */
/* 회원가입시 로그인이 되어있지 않은지 체크하기 위해 isNotLogin 함수 정의 후 사용 (auth 폴더 안 auth.js 파일 참고)  */
router.get("/join", isNotLogIn, (req, res, next) => {
  res.render("join");
});

router.get("/join_main", isNotLogIn, (req, res, next) => {
  res.render("join_main");
});

router.get("/Pjoin", isNotLogIn, (req, res, next) => {
  res.render("join_Per");
});


/* 회원가입시 데이터 유효성 검사, front에서도 검증 하지만 express-validator 모듈을 이용해 DB에 들어가기 전 한번 더 검사 */
router.post('/join', [
  // .notEmpty() : 값이 비어있는지 확인, 비어있지 않다면 pass, 비어 있다면 error
  // .bail() : 만약 앞에서 error가 있다면 뒷부분은 확인하지 않고 바로 error를 return
  // .trim() : 공백을 없애주는 기능
  // .withmessage('message') : 에러 발생 시 메시지와 함께 에러를 띄움
  // .isLength({min:5 , max:20}) : 최소 길이와 최대길이 지정
  // .isAlphanumeric() : 알파벳인지 확인, 또한 ignore를 통해 예외처리
  // .isStrongPassword() : 강력한 패스워드를 사용하는지 확인 (대문자, 소문자, 숫자, 특수문자 하나 이상씩 사용)
  // .custom() : 내가 원하는 기능을 지정하기 위한 함수
  // https://github.com/validatorjs/validator.js 참고
  body('number').notEmpty().bail().trim().withMessage('사업자 번호를 확인해주세요.').bail(),
  body('e_name').notEmpty().bail().trim().isLength({ max: 20 }).withMessage('회사명을 확인해주세요.').bail(),
  body('nickname').notEmpty().bail().trim().isLength({ min: 5, max: 20 }).isAlphanumeric('en-US', { ignore: '_-' }).withMessage('닉네임을 확인해주세요.').bail(),
  body('id').notEmpty().bail().trim().isLength({ min: 5, max: 20 }).isAlphanumeric('en-US', { ignore: '_-' }).withMessage('id를 확인해주세요.').bail(),
  body('pw').notEmpty().bail().trim().isLength({ min: 8, max: 16 }).isAlphanumeric('en-US', { ignore: '~!@#$%^&*()_+|<>?:{}]/;' }).isStrongPassword().withMessage('비밀번호를 확인해주세요.').bail(),
  body('pw_check').custom((value, { req, res, path }) => {
    if (value !== req.body.pw) {
      res.send("<script>alert('비밀번호 확인이 맞지 않습니다. ');location.href='/user/join';</" + "script>");
      //res.redirect('/user/join')
    } else {
      return value;
    }
  }),
  validatorErrorChecker
], (req, res) => {
  // 위에서 패스워드 검증이 끝났다면 DB에 회원 정보 등록
  const info = {
    "number": req.body.number,
    "e_name": req.body.e_name,
    "e_address": req.body.e_address,
    "nickname": req.body.nickname,
    "id": req.body.id,
    "email": req.body.f_email + "@" + req.body.s_email
  };
  // bcrypt 모듈을 이용해 password 해싱 후 저장
  bcrypt.hash(req.body.pw, 10, function (err, hash) {
    if (err) return next(err)
    info['pw'] = hash;

    var sql = 'INSERT INTO Customers_Enterprise(enterprise_number, e_name, e_address, nickname, e_customer_id, e_customer_pw, e_customer_email) VALUES(?,?,?,?,?,?,?)';
    var params = [info['number'], info['e_name'], info['e_address'], info['nickname'], info['id'], info['pw'], info['email']];
    
    mdbConn.dbInsert(sql, params)
      .then((rows) => {
        if (!rows) res.send("<script>alert('잘못된 접근입니다.');location.href='/';</" + "script>");
        else res.send("<script>alert('회원가입이 완료되었습니다.!! ');location.href='/user/login';</" + "script>");
      })
      .catch((errMsg) => {
        res.send("<script>alert('잘못된 접근입니다.');location.href='/';</" + "script>");
      });

  })

});

router.post("/number_check", function (req, res, next) {
  const USE = req.body.use;
  if (USE == "폐업자") {
    res.send("휴/폐업 사업자번호입니다. 해당 정보로 사업자 구매회원 가입은 불가합니다.");
  } else if (USE == "") {
    res.send("등록되지 않은 사업자 번호 입니다. 사업자 번호 확인해 주세요.");
  } else if (USE == "계속사업자") {
    res.send("true");
  }
});

// ======================================================

router.post("/biz_num", function (req, res, next) {
  const number = req.body.NUMBER;

  if (req.body.NUMBER != undefined) {
    var sql = "SELECT enterprise_number FROM Customers_Enterprise WHERE enterprise_number=?";
    var params = number;
  }

  mdbConn.dbSelect(sql, params)
    .then((rows) => {
      if (rows) {
        res.send(true);
      } else {
        res.send(false);
      }
    })
    .catch((errMsg) => {
      console.log(errMsg);
    });
});

// ======================================================

router.post("/check_overlap", function (req, res, next) { //ID 중복 체크
  if (req.body.NUMBER != undefined) {
    const number = req.body.NUMBER;
    var sql = "SELECT enterprise_number FROM Customers_Enterprise WHERE enterprise_number=?";
    var params = number;
  } else if (req.body.ID != undefined) {
    const id = req.body.ID;
    var sql = "SELECT e_customer_id FROM Customers_Enterprise WHERE e_customer_id=?";
    var params = id;
  } else if (req.body.NICKNAME != undefined) {
    const nickname = req.body.NICKNAME;
    var sql = "SELECT nickname FROM Customers_Enterprise WHERE nickname=?";
    var params = nickname;
    //if (req.session.joinUser.nickname == req.body.NICKNAME) return res.send(false);
  }

  mdbConn.dbSelect(sql, params)
    .then((rows) => {
      if (rows) {
        res.send(true);
      } else {
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
    res.cookie('hashAuth', hashAuth, { maxAge: 300000 });
    res.send(true);
  } else {
    res.send(false);
  }
});

router.post("/mail_check", function mail_check(req, res, next) { //인증번호 체크
  const mail_check = req.body.mail_check;
  if (req.cookies.hashAuth != undefined) {
    const hashAuth = req.cookies.hashAuth;
    try {
      if (bcrypt.compareSync(mail_check, hashAuth)) {
        res.clearCookie('hashAuth');
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

router.post("/check_all", function (req, res, next) { //회원가입 검증
  const { Number_check, checkNICKNAME, checkID, checkPW, comparePW, checkMAIL, checkBOX } = req.body;
  if (checkID != undefined) {
    if (Number_check == "false") {
      res.send("사업자번호를 다시 확인하여 주세요.")
    } else if (checkNICKNAME == "false") {
      res.send("닉네임을 다시 확인하여 주세요.")
    } else if (checkID == "false") {
      res.send("아이디를 다시 확인하여 주세요.");
    } else if (checkPW == "false") {
      res.send("비밀번호를 다시 확인하여 주세요.");
    } else if (comparePW == "false") {
      res.send("비밀번호 확인을 다시 확인하여 주세요.");
    } else if (checkMAIL == "false") {
      res.send("인증번호를 다시 확인하여 주세요.");
    } else if (checkBOX == "false") {
      res.send("기업 회원 약관 및 개인정보 수집 및 이용에 동의를 해주세요!");
    } else {
      res.send(true);
    }
  } else if (checkID == undefined) {
    if (checkNICKNAME == "false") {
      res.send("닉네임을 다시 확인하여 주세요.")
    } else if (checkPW == "false") {
      res.send("비밀번호를 다시 확인하여 주세요.");
    } else if (comparePW == "false") {
      res.send("비밀번호 확인을 다시 확인하여 주세요.");
    } else if (checkMAIL == "false") {
      res.send("인증번호를 다시 확인하여 주세요.");
    } else {
      res.send(true);
    }
  }
});

// ----------------------ID, PW 찾기------------------------------------------ 

router.get("/find_main", isNotLogIn, (req, res, next) => { //아이디 패스워드 찾기
  res.render("findIdpw_main");
});

// ====== 개인회원 아이디 찾기 ======


router.get("/find_id", isNotLogIn, (req, res, next) => {
  res.render("findIdPer");
});

router.post("/find_id", async function (req, res, next) {
  const { f_email, s_email, email_check } = req.body;
  mail = f_email + "@" + s_email;
  const hashAuth = req.cookies.hashAuth;


  try {
    if (bcrypt.compareSync(email_check, hashAuth)) {
      var sql = "SELECT e_customer_id FROM Customers_Enterprise WHERE e_customer_email=?"
      var rows = await mdbConn.dbSelect(sql, mail);
      rows = rows.e_customer_id
      res.cookie('rows', rows, { maxAge: 10 });
      res.redirect("/user/findIdPer");
    } else {
      res.send("<script>alert('비정상적인 접근입니다.');location.href='/user/find_id';</" + "script>");
    }
  } catch (err) {
    res.send("<script>alert('해당 이메일이 존재하지 않습니다. 다시 시도해 주세요.!');location.href='/user/find_id';</" + "script>");
  }
});

// ==================================

// ====== 기업회원 아이디 찾기 ======

router.get("/find_Cid", isNotLogIn, (req, res, next) => {
  res.render("findIdCor");
});

router.post("/find_Cid", async function (req, res, next) {
  const { f_email, s_email, email_check } = req.body;
  mail = f_email + "@" + s_email;
  const hashAuth = req.cookies.hashAuth;
  try {
    if (bcrypt.compareSync(email_check, hashAuth)) {
      var sql = "SELECT e_customer_id FROM Customers_Enterprise WHERE e_customer_email=?"
      var rows = await mdbConn.dbSelect(sql, mail);
      rows = rows.e_customer_id
      res.cookie('rows', rows, { maxAge: 10 });
      res.redirect("/user/findIdCor");
    } else {
      res.send("<script>alert('비정상적인 접근입니다.');location.href='/user/find_Cid';</" + "script>");
    }
  } catch (err) {
    res.send("<script>alert('해당 이메일이 존재하지 않습니다. 다시 시도해 주세요.!');location.href='/user/find_Cid';</" + "script>");
  }
});


router.post("/find_Cid_biz", async function (req, res, next) {
  const number = req.body.biz_num;
  try{
    if(number!=undefined){
      var sql = "SELECT e_customer_id FROM Customers_Enterprise WHERE enterprise_number=?";
      var row = await mdbConn.dbSelect(sql, number);
      row = row.e_customer_id;
      res.cookie('row', row, { maxAge: 1000 }); //HELP 10으로 하니까 안됨
      res.redirect("/user/findIdCor");
    }
  }catch(err){
    res.send("<script>alert('해당 사업자등록번호가 존재하지 않습니다. 다시 시도해 주세요.!');location.href='/user/find_Cid';</" + "script>");
  }
});

// ====================================

// ====== 기업, 개인회원 id 조회 ======

router.get("/findIdPer", isNotLogIn, function (req, res, next) { 
  if (req.cookies.row != undefined) {
    const row = req.cookies.row;
    res.render("findIdPer_1", { ID: row });
  } else {
    res.render("home");
  }
});

router.get("/findIdCor", isNotLogIn, function (req, res, next) { 
  if (req.cookies.row != undefined) {
    const row = req.cookies.row;
    res.render("findIdCor_1", { ID: row });
  } else {
    res.render("home");
  }
});

// ====================================


// findPwCor findPwPer 뭐에서 왔는지에 따라 render되는 페이지가 달라야함
router.get("/find_pw", isNotLogIn, function (req, res, next) { //pw 찾기
  res.render("findPwPer");
});

router.get("/find_Cpw", isNotLogIn, function (req, res, next) { //pw 찾기
  res.render("findPwCor");
});

router.post("/find_pw", isNotLogIn, async function (req, res, next) { //pw 찾기
  const { find_id, f_email, s_email, email_check } = req.body;
  const info = {
    "id": find_id,
    "mail": f_email + "@" + s_email
  };
  try {
    var sql = "SELECT * FROM Customers_Enterprise WHERE e_customer_id=? AND e_customer_email=?"
    params = [info['id'], info['mail']];

    var rows = await mdbConn.dbSelect(sql, params);

    res.cookie('rows', rows, { maxAge: 100000 });
    res.redirect("/user/findPwPer");
  } catch (err) {
    res.send("<script>alert('아이디 또는 이메일이 알맞지 않습니다.');location.href='/user/find_pw';</" + "script>");
    console.error(err);
  }
});

router.get("/findPwPer", isNotLogIn, function (req, res, next) { //pw 초기화 화면
  if (req.cookies.rows != undefined) {
    res.render("findPwPer_1");
  } else {
    res.render("home");
  }
});

router.post("/findPwPer", isNotLogIn, function (req, res, next) { //pw 초기화 실행
  if (req.cookies.rows != undefined) {
    rows = req.cookies.rows;
    const { init_pw, init_pw_check } = req.body;
    if (init_pw == init_pw_check) {
      bcrypt.hash(init_pw, 10, function (err, hash) {
        if (err) return next(err)
        const info = {
          "pw": hash,
          "id": rows.e_customer_id,
          "mail": rows.e_customer_email
        };

        var sql = 'UPDATE Customers_Enterprise SET e_customer_pw=? WHERE e_customer_id = ? AND e_customer_email = ?';
        params = [info['pw'], info['id'], info['mail']];

        mdbConn.dbInsert(sql, params)
          .then((rows) => {
            if(!rows) res.send("<script>alert('잘못된 접근입니다.');location.href='/';</" + "script>");
            else {
              res.send("<script>alert('비밀번호가 정상적으로 변경되었습니다.');location.href='/user/login';</" + "script>");
              res.clearCookie('rows');
            }
          })
          .catch((errMsg) => {
            res.send("<script>alert('잘못된 접근입니다.');location.href='/';</" + "script>");
          });
      })
    } else {
      res.send("<script>alert('비정상적인 접근입니다.');location.href='/';</" + "script>");
    }
  } else {
    res.send("<script>alert('세션이 만료되었습니다.');location.href='/';</" + "script>");
  }
});

router.get("/loginerror", isNotLogIn, (req, res, next) => {
  res.render("loginerror");
});

router.get("/addinfo", isLogIn, (req, res, next) => {
  res.render("addinfo");
});

router.post('/addinfo', (req, res) => {
  // 위에서 패스워드 검증이 끝났다면 DB에 회원 정보 등록
  const info = {
    "number": req.body.number,
    "e_name": req.body.e_name,
    "e_address": req.body.e_address,
    "id_idx" : req.user.id_idx
  };

    var sql = 'UPDATE Customers_Enterprise SET enterprise_number = ?, e_name =? , e_address =?  WHERE id_idx = ?';
    var params = [info['number'], info['e_name'], info['e_address'], info['id_idx']];

    mdbConn.dbInsert(sql, params)
      .then((rows) => {
        if (!rows) res.send("<script>alert('잘못된 접근입니다.');window.reload();</" + "script>");
        else res.send("<script>alert('기업 정보 추가가 완료되었습니다.!! ');window.close()</" + "script>");
      })
      .catch((errMsg) => {
        res.send("<script>alert('잘못된 접근입니다.');window.reload();</" + "script>");
      });
});

router.post('/checkInfo',(req, res) => {
  if(req.user.enterprise_number == "NULL"){
    res.send(false)
  }
  else next()
})
router.post("/check_num", function (req, res, next) { //회원가입 검증
  const { Number_check} = req.body;
    if (Number_check == "false") {
      res.send("사업자번호를 다시 확인하여 주세요.")
    } else {
      res.send(true);
    }
});


module.exports = router;