const mariadb = require('mariadb');
const vals = require('./consts.js');
 
const con = mariadb.createPool({
    host: vals.DBHost, port:vals.DBPort,
    user: vals.DBUser, password: vals.DBPass,
    connectionLimit: vals.connectionLimit,
});
 
/* <test 용도>
async function GetUserList(database, tables){
    let conn, rows;
    try{
        conn = await con.getConnection();
        conn.query('USE '+database);
        rows = await conn.query('SELECT * FROM '+tables);
    }
    catch(err){
        throw err;
    }
    finally{
        if (conn) conn.end();
        return rows[0];
    }
}*/

//DB insert
function DBInsert(sql, params){
    con.query(sql, params, function(err, rows, fields){
        if(err){
            console.log(err);
        } else{
            console.log(rows.name);
        }
    });
}
 
module.exports = {
    //getUserList: GetUserList,
    dbInsert: DBInsert
}