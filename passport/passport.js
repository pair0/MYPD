const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const mdbConn = require('../db_connection/mariaDBConn')
require("dotenv").config();

const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretOrKey;

// module.exports = passport => {
//     passport.use(new JWTStrategy(opts, async (jwt_payload, done) =>{
//         var sql = `SELECT * FROM Customers_Enterprise WHERE e_customer_id = "${jwt_payload.id}" ;`
//         await mdbConn.loginquery(sql).then(result => {
//             if(result) {
//                 return done(null, result);
//             }
//             return done(null, false);
//         })
//         .catch(err => console.log(err));
//     }));
// };