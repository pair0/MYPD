const { validationResult} = require("express-validator");

module.exports = {
    isLogIn : function (req,res, next) {
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
    },
    validatorErrorChecker :  (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            return res.redirect('/user/join');
        }
        next();
    },
    myLogIn : function (req,res, next) {
        req.session.return = req.originalUrl;
        if(res.locals.isAuthenticated == true) next();
        else res.redirect('/user/loginerror')
    },
}