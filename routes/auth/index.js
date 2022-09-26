var express = require('express');
const router = express.Router();
var passport = require('passport');
const axios = require('axios');
require('dotenv').config();


//* 카카오로 로그인하기 라우터 ***********************
//? /kakao로 요청오면, 카카오 로그인 페이지로 가게 되고, 카카오 서버를 통해 카카오 로그인을 하게 되면, 다음 라우터로 요청한다.
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', (req, res, next) => {
  passport.authenticate('kakao', (err, user, info) => { // passport-kakao 전략 done 함수의 파라미터가 여기 콜백 함수의 인자로 전달된다.
    if (err) {
      return next(err);
    }
      req.session.joinUser = {
        enterprise_num : info['enterprise_number'],
        id : info['e_customer_id'],
        nickname : info['nickname'],
        snsID: info['snsID'],
        email: info['e_customer_email'],
        accessToken : info['accessToken']
      };
      req.session.save(() => {
        // 세션이 생성되면 사용자를 회원가입 페이지로 리다이렉트 시킨다.
        return req.logIn(info, (error) => {
          if (error) {
            return console.error(error);
          }
          res.redirect(`/main`);    
        });
      });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 호출 별도로 진행
});

// 카카오 로그아웃
// auth//kakao/logout
router.get('/kakao/logout', async (req,res)=>{
  // https://kapi.kakao/com/v1/user/logout
  try {
    const ACCESS_TOKEN = req.user.accessToken
    let logout = await axios({
      method:'post',
      url:'https://kapi.kakao.com/v1/user/unlink',
      headers:{
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    });
  } catch (error) {
    console.error(error);
    res.json(error);
  }
  // 세션 정리
  req.logout(function(err) {
    if (err) { return next(err); }
  });
  req.session.destroy(function (err) {
    if (err)
        console.log(err)
    else {
      console.log("카카오 로그아웃")
      res.clearCookie('connect.sid');
      res.redirect('/main');
    }
  });
})

router.get('/naver', passport.authenticate('naver', { authType: 'reauthenticate' }));
//? 위에서 네이버 서버 로그인이 되면, 네이버 redirect url 설정에 따라 이쪽 라우터로 오게 된다.
router.get('/naver/callback', (req, res, next) => {
  passport.authenticate('naver', (err, user, info) => { // passport-kakao 전략 done 함수의 파라미터가 여기 콜백 함수의 인자로 전달된다.
    if (err) {
      return next(err);
    }
    // console.log(info)
      req.session.joinUser = {
        enterprise_num : info['enterprise_number'],
        id : info['e_customer_id'],
        nickname : info['nickname'],
        snsID: info['snsID'],
        email: info['e_customer_email'],
        accessToken : info['accessToken']
      };
      req.session.save(() => {
        // 세션이 생성되면 사용자를 회원가입 페이지로 리다이렉트 시킨다.
        return req.logIn(info, (error) => {
          if (error) {
            return console.error(error);
          }
          res.redirect(`/main`);    
        });
      });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 호출 별도로 진행
});

//* 구글로 로그인하기 라우터 ***********************
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })); // 프로파일과 이메일 정보를 받는다.

//? 위에서 구글 서버 로그인이 되면, 네이버 redirect url 설정에 따라 이쪽 라우터로 오게 된다. 인증 코드를 박게됨
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => { // passport-kakao 전략 done 함수의 파라미터가 여기 콜백 함수의 인자로 전달된다.
    if (err) {
      return next(err);
    }
      req.session.joinUser = {
        enterprise_num : info['enterprise_number'],
        id : info['e_customer_id'],
        nickname : info['nickname'],
        snsID: info['snsID'],
        email: info['e_customer_email'],
        accessToken : info['accessToken']
      };
      req.session.save(() => {
        // 세션이 생성되면 사용자를 회원가입 페이지로 리다이렉트 시킨다.
        return req.logIn(info, (error) => {
          if (error) {
            return console.error(error);
          }
          res.redirect(`/main`);    
        });
      });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 호출 별도로 진행
});

module.exports = router;