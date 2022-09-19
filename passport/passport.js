const LocalStragegy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

const passportloginVerify = async (username, password, done) => {
    try {
        const user = await User.findOne({ where: { email: username } });

        if (!user) {
            done(null, false, { message: `존재하지 않는 사용자입니다.` });
            return;
        }
        const compareResult = await bcrypt.compare(password, user.password);

        if (compareResult) {
            done(null, user);
            return;
        }

        done(null, false, { reason: "올바르지 않은 비밀번호 입니다." });
        } catch (e) {
            console.log(e);
            done(e);
        }
};

let passportConfig = {
    usernameField: "id",
    passwordField: "pw",
    session: true
};

passport.use(
    "signin",
    new LocalStragegy(passportConfig, passportloginVerify)
);
passport.serializeUser((user,done)=>{ 
    done(null,user);
});x``
passport.deserializeUser((user,done)=>{
    done(null,user);
});