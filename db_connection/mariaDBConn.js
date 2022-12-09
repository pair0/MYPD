const mariadb = require('mariadb');
require("dotenv").config();

const con = mariadb.createPool({
    host: process.env.DBHost, port:process.env.DBPort,
    user: process.env.DBUser, password: process.env.DBPass,
    connectionLimit: process.env.connectionLimit,
    database :  process.env.database
});

//DB insert
async function DBInsert(sql, params){
    let conn;
    try{
        conn = await con.getConnection();
        rows = await conn.query(sql, params);
        if (conn) conn.end();
        return true;
    }
    catch(err){
        console.log(err)
        return false;
    }
}

//DB select
async function DBSelect(sql, params){
    let conn, rows;
    try{
        conn = await con.getConnection();
        rows = await conn.query(sql, params);
        if (conn) conn.end();
        return rows[0];
    }
    catch(err){
        return false;
    }
}

async function DBSelectAll(sql, params){
    let conn, rows;
    try{
        conn = await con.getConnection();
        rows = await conn.query(sql, params);
        if (conn) conn.end();
        return rows;
    }
    catch(err){
        return false;
    }
}

module.exports = {
    dbInsert: DBInsert,
    dbSelect: DBSelect,
    dbSelectall : DBSelectAll,
}