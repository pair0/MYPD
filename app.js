var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const routes = require('./routes');
var passport = require('passport');
var session = require('express-session');
var app = express();
require('dotenv').config();
require('./passport');
const { swaggerUi_api, specs_api } = require("./swagger/api_test")
const { swaggerUi_svc, specs_svc } = require("./swagger/svc_test")

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized : false,
  secret: process.env.COOKIE_SECRET,
  rolling : true,
  cookie:{
      httpOnly: true,
      secure: false,
      maxAge :  1000 * 60 * 30,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.isSns = false;
  if(req.user != undefined){
    if(req.user.snsID != null)
      res.locals.isSns = true;
  }
  next();
});

var options = {
  customCssUrl : '/stylesheets/swagger.css',
  docExpansion:"full",
  // customJs: '/javascripts/custom.js'
};

app.use('/api_test', function(req,res,next) {
  specs_api.servers = []; 
  specs_api.servers.push({url:req.session.server})
  req.swaggerDoc = specs_api
  next();
},swaggerUi_api.serveFiles(specs_api, options), swaggerUi_api.setup(specs_api, options));

var options1 = {
  customCssUrl : '/stylesheets/swagger.css',
};
app.use('/svc_test',  swaggerUi_svc.serveFiles(specs_svc, options1), swaggerUi_svc.setup(specs_svc,options1));



// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;