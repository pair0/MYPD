const mariadb = require('mariadb');
const vals = require('./consts.js');

const con = mariadb.createPool({
    host: vals.DBHost, port:vals.DBPort,
    user: vals.DBUser, password: vals.DBPass,
    connectionLimit: vals.connectionLimit,
    database: vals.database
});
<<<<<<< HEAD
 

=======
/* <test 용도>
>>>>>>> 3728bfa04184d21264c84b5fa7139c0dec926ac7
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
<<<<<<< HEAD
 

module.exports = {
    getUserList: GetUserList,
    dbInsert: DBInsert
=======
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
>>>>>>> 3728bfa04184d21264c84b5fa7139c0dec926ac7
}