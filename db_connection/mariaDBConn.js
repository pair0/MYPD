const mariadb = require('mariadb');
const vals = require('./consts.js');

const con = mariadb.createPool({
    host: vals.DBHost, port:vals.DBPort,
    user: vals.DBUser, password: vals.DBPass,
    connectionLimit: vals.connectionLimit,
    database :  vals.database
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
async function DBInsert(sql, params){
    let conn;
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

async function loginQuery(query){
    let conn, results;
    try{
        conn = await con.getConnection();
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