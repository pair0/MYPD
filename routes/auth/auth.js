var url = require('url')
var http = require('http');

module.exports = {
    isLogIn : function (req,res, next) {
        console.log(req.originalUrl, "1")
        req.session.return = req.originalUrl;
        if(res.locals.isAuthenticated == true) next();
        else res.redirect('/user/login')
    },
    isNotLogIn : function (req,res, next) {
        if(res.locals.isAuthenticated == false) next();
        else res.redirect('/main')
    },
    isSNSLogIn : (req,res,next) => {
        if(req.session.joinUser.snsID != null) res.redirect('/mypage/edit');
        else next();
    }
}