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
    // console.log('user callback')
      console.log("info")
      req.session.joinUser = {
        enterprise_num : info['enterprise_num'],
        id : info['id'],
        nickname : info['nickname'],
        snsId: info['snsID'],
        email: info['email'],
        accessToken : info['accessToken']
      };
      // console.log(req.session)
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
    console.log(req.user.accessToken);
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
  console.log(req.session);
  req.logout(function(err) {
    if (err) { return next(err); }
  });
  req.session.destroy();
  res.redirect('/main');
  console.log(req.isAuthenticated());
})

module.exports = router;