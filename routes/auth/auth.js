module.exports = {
    isLogIn : function (req,res, next) {
        if(res.locals.isAuthenticated == true) next();
        else res.redirect('/user/login')
    },
    isNotLogIn : function (req,res, next) {
        if(res.locals.isAuthenticated == false) next();
        else res.redirect('/main')
    }
}