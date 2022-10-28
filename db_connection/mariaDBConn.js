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
        console.log(err)
        throw err;
    }
    finally{
        if (conn) conn.end();
        return rows;
    }
}

async function DBCheck (req, res, next){
    var sql = "SELECT COUNT(*) FROM service_test WHERE id_idx = ?"
    var params = [req.user.id_idx];

    DBSelect(sql,params)
    .then((rows) => {
        if(rows['COUNT(*)'] == 0) 
            res.render('reg_svc_no');
        else
            res.render('reg_svc_list');
    })
}

async function DBCheck_data (req, res, next){
    var sql = "SELECT COUNT(*) FROM data_test WHERE id_idx = ?"
    var params = [req.user.id_idx];

    DBSelect(sql,params)
    .then((rows) => {
        if(rows['COUNT(*)'] == 0) 
            res.render('editdata_no');
        else
            res.render('editdata_list');
    })
}

async function DBCheck_server (req, res, next){
    var sql = "SELECT COUNT(*) FROM server_management WHERE id_idx = ?"
    var params = [req.user.id_idx];

    DBSelect(sql,params)
    .then((rows) => {
        if(rows['COUNT(*)'] == 0) 
            res.render('reg_svr_no');
        else
            res.render('reg_svr_list');
    })
}

async function DBCheck_inter (req, res, next){
    var sql = "SELECT COUNT(*) FROM inter_server WHERE id_idx = ?"
    var params = [req.user.id_idx];

    DBSelect(sql,params)
    .then((rows) => {
        if(rows['COUNT(*)'] == 0) 
            res.render('editinte_no');
        else
            res.render('editinte');
    })
}

module.exports = {
    dbInsert: DBInsert,
    dbSelect: DBSelect,
    dbSelectall : DBSelectAll,
    dbCheck : DBCheck,
    dbCheck_inter : DBCheck_inter,
    dataCheck : DBCheck_data,
    svrCheck : DBCheck_server
}