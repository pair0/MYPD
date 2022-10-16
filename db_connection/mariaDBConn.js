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
    }
    catch(err){
        console.log(err)
        return err;
    }
    finally{
        if (conn) conn.end();
        return "sucess";
    }
}

//DB select
async function DBSelect(sql, params){
    let conn, rows;
    try{
        conn = await con.getConnection();
        rows = await conn.query(sql, params);
        // console.log(rows[0])
    }
    catch(err){
        return err;
    }
    finally{
        if (conn) conn.end();
        return rows[0];
    }
}

async function DBSelectAll(sql, params){
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
        return rows;
    }
}

function DBCheck (req, res, next){
    var sql = "SELECT COUNT(*) FROM service_test WHERE id_idx = ?"
    var params = [req.user.id_idx];

    DBSelect(sql,params)
    .then((rows) => {
        if(rows['COUNT(*)'] == 0) 
            res.redirect('/mypage/reg_svc_no');
        else
            next();
    })
}

function DBCheck_data (req, res, next){
    var sql = "SELECT COUNT(*) FROM data_test WHERE id_idx = ?"
    var params = [req.user.id_idx];

    DBSelect(sql,params)
    .then((rows) => {
        if(rows['COUNT(*)'] == 0) 
            res.redirect('/mypage/editdata_no');
        else
            next();
    })
}

function DBCheck_server (req, res, next){
    var sql = "SELECT COUNT(*) FROM server_management WHERE id_idx = ?"
    var params = [req.user.id_idx];

    DBSelect(sql,params)
    .then((rows) => {
        if(rows['COUNT(*)'] == 0) 
            res.redirect('/mypage/reg_svr_no');
        else
            next();
    })
}


module.exports = {
    dbInsert: DBInsert,
    dbSelect: DBSelect,
    dbSelectall : DBSelectAll,
    dbCheck : DBCheck,
    dataCheck : DBCheck_data,
    svrCheck : DBCheck_server
}