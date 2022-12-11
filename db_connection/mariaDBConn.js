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

async function DBCheck_data (req, res, next){
    var sql = "SELECT COUNT(*) FROM data_test WHERE id_idx = ?"
    var params = [req.user.id_idx];
    DBSelect(sql,params)
    .then((rows) => {
        if(rows['COUNT(*)'] == 0) {
            const dataname = ["진료내역 조회", "처방전교부목록", "수진자상병내역", "의료기관약제내역", "의료데이터 명세서"]
            const business_right = ['의료','의료','의료','의료','의료']
            const data_api = ["[진료정보제공 API] 진료내역 조회 API", '[진료정보제공 API] 처방전교부내역 조회 API', '[진료정보제공 API] 수진자상병내역 조회 API', '[의약품정보제공 API] 의료기관약제내역 조회 API', '[의료명세서 API] 명세서 내역 조회 API']
            const data = [{
                    "SPEC_ID": 9999,
                    "IDV_ID": 1234123,
                    "AGE_GROUP": 6,
                    "SEX":1,
                    "FORM_CD": 21,
                    "CL_CD": 11,
                    "MAIN_SICK": "S96",
                    "SUB_SICK": "S93",
                    "DSBJT_CD": 5,
                    "PRCL_SYM_TP_CD": "-",
                    "INJ_EXA_TP_CD": "-",
                    "OINJ_TP_CD": "C",
                    "DGRSLT_TP_CD":9,
                    "RECU_FR_DT": 20201010,
                    "RECN": 15,
                    "DMD_YPAY_XPNS_TOT_AMT": 789200
                },
                {
                    "SPEC_ID": 8888,
                    "IDV_ID": 1234123,
                    "AGE_GROUP": 6,
                        "SEX":1,
                    "FORM_CD": 21,
                    "CL_CD": 11,
                    "MAIN_SICK": "S96",
                    "SUB_SICK": "S93",
                    "DSBJT_CD": 5,
                    "PRCL_SYM_TP_CD": "-",
                        "INJ_EXA_TP_CD": "-",
                    "OINJ_TP_CD": "C",
                    "DGRSLT_TP_CD":9,
                    "RECU_FR_DT": 20201010,
                    "RECN": 15,
                    "DMD_YPAY_XPNS_TOT_AMT": 789200
                },
                {
                    "SPEC_ID": 7777,
                    "IDV_ID": 1234123,
                    "AGE_GROUP": 6,
                    "SEX":1,
                    "FORM_CD": 21,
                    "CL_CD": 11,
                    "MAIN_SICK": "S96",
                    "SUB_SICK": "S93",
                    "DSBJT_CD": 5,
                    "PRCL_SYM_TP_CD": "-",
                    "INJ_EXA_TP_CD": "-",
                    "OINJ_TP_CD": "C",
                    "DGRSLT_TP_CD":9,
                    "RECU_FR_DT": 20201010,
                    "RECN": 15,
                    "DMD_YPAY_XPNS_TOT_AMT": 789200
                },
                {
                    "SPEC_ID": 5555,
                    "IDV_ID": 1234123,
                    "AGE_GROUP": 6,
                    "SEX":1,
                    "FORM_CD": 21,
                    "CL_CD": 11,
                    "MAIN_SICK": "S96",
                    "SUB_SICK": "S93",
                    "DSBJT_CD": 5,
                    "PRCL_SYM_TP_CD": "-",
                    "INJ_EXA_TP_CD": "-",
                    "OINJ_TP_CD": "C",
                    "DGRSLT_TP_CD":9,
                    "RECU_FR_DT": 20201010,
                    "RECN": 15,
                    "DMD_YPAY_XPNS_TOT_AMT": 789200
                },
                {
                    "SPEC_ID": 1111,
                    "IDV_ID": 1234123,
                    "AGE_GROUP": 6,
                    "SEX":1,
                    "FORM_CD": 21,
                    "CL_CD": 11,
                    "MAIN_SICK": "S96",
                    "SUB_SICK": "S93",
                    "DSBJT_CD": 5,
                    "PRCL_SYM_TP_CD": "-",
                    "INJ_EXA_TP_CD": "-",
                    "OINJ_TP_CD": "C",
                    "DGRSLT_TP_CD":9,
                    "RECU_FR_DT": 20201010,
                    "RECN": 15,
                    "DMD_YPAY_XPNS_TOT_AMT": 789200
                }
            ]
            for (var i = 0; i < dataname.length; i++) {
                var info = {
                    "id": req.user.id_idx,
                    "data_name": dataname[i],
                    "enterprise_code" : req.user.enterprise_number,
                    "business_right" : business_right[i],
                    "consents" : "false",
                    "asset_id" : i,
                    "data_api" : data_api[i],
                    "data_json" : data[i]
                };
                var sql = "INSERT INTO data_test(data_name, enterprise_code, business_right,consents, asset_id,data_api,data_json,id_idx) VALUES(?,?,?,?,?,?,?,?)";
                var params = [info['data_name'], info['enterprise_code'], info['business_right'], info['consents'], info['asset_id'], info['data_api'],info['data_json'],info['id']];
                
                DBInsert(sql, params)
                .then((row) => {
                })
                .catch((err) => {
                    console.log(err)
                })
            }
            res.render('reg_data');
        }
        else
            res.render('reg_data');
    })
}

async function DBCheck_server (req, res, next){
    var sql = "SELECT COUNT(*) FROM server_management WHERE id_idx = ?"
    var params = [req.user.id_idx];

    DBSelect(sql,params)
    .then((rows) => {
        if(rows['COUNT(*)'] == 0) {
            const info = {
                "id": req.user.id_idx,
                "ip": "https://mypd.kr:62514",
                "svr_name" : "API TEST SERVER",
                "biz_type" : "의료",
                "svr_desc" : "API TEST SERVER"
            };
            var sql = "INSERT INTO server_management(server_ip, server_name, business_right, server_explain, id_idx) VALUES(?,?,?,?,?)";
            var params = [info['ip'], info['svr_name'], info['biz_type'], info['svr_desc'], info['id']];
            
            DBInsert(sql, params)
            .then((row) => {
            res.render('reg_svr');
            })
            .catch((err) => {
                console.log(err)
            })
        }
        else
            res.render('reg_svr');
    })
}

module.exports = {
    dbInsert: DBInsert,
    dbSelect: DBSelect,
    dbSelectall : DBSelectAll,
    DBCheck_data : DBCheck_data,
    DBCheck_server : DBCheck_server
}