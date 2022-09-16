const mariadb = require('mariadb');
const vals = require('./consts.js');

const con = mariadb.createPool({
    host: vals.DBHost, port:vals.DBPort,
    user: vals.DBUser, password: vals.DBPass,
    connectionLimit: vals.connectionLimit,
    database: vals.database
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
}
*/
//DB insert
async function DBInsert(sql, params){
    let conn, rows;
    try{
        conn = await con.getConnection();
        rows = await conn.query(sql, params);
    }
    catch(err){
        throw err;
    }
    finally{
        if (conn) conn.end();
        return "sucess";
    }
}

//DB select
function DBselect(sql, params){
    con.query(sql, params, function(err, rows, fields){
        if(err){
            console.log(err);
        } else{
            console.log(sucess);
        }
    });
}
async function loginQuery(query,database){
    let conn, results;
    try{
        conn = await con.getConnection();
        conn.query('USE ' + database);
        results = await conn.query(String(query));
    }   
    catch(err){
        throw err;
    }
    finally{
        if (conn) conn.end();
        return results;
    }
}

module.exports = {
    //getUserList: GetUserList,
    dbInsert: DBInsert,
    loginquery: loginQuery
}