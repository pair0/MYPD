const {getTokenChk} = require("../passport/abouttoken");
const mdbConn = require('../db_connection/mariaDBConn');
const e = require("express");

function yyyymmdd(timestamp , option = "FULL") {
    var d = new Date(timestamp), // Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
    dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.
    hh = d.getHours(),
    min = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
    time;
        
    if (hh < 12)
        h = "0" + hh
    else
        h = hh;

    if(option == "FULL")
        // ie: 201302180835  
        time = yyyy + mm + dd + h + min
    else if(option == "ORDER")
        time = yyyy + '.' + mm + '.' + dd + ' ' + h + ':' + min
    else
        time = yyyy + mm + dd
    return time;
}
// info_key = ['AccessToken']
// info_key = ['client_id']

function checkAndAPICall(res, info, responseAlpa){
    const sql = {
        'checkOrg_code' :'SELECT * FROM Customers_Enterprise WHERE enterprise_number = ?',
        'checkAccessToken' :'SELECT * FROM service_test WHERE access_token = ?',
        'checkClientId' :'SELECT * FROM service_test WHERE service_client_id = ?'
    }
    const key_value = {
        'org_code' : 'checkOrg_code',
        'AccessToken' : 'checkAccessToken',
        'client_id' : 'checkClientId'
    }
    var response = {
        "rsp_code" : "",
        "rsp_msg" : "",
        "search_timestamp" : yyyymmdd(new Date().getTime()) //YYYYMMDDHHMM
    }
    const key = Object.keys(info);
    var params = [info['org_code']];
    if(info[key[1]].slice(0,7) != "Bearer "){
        info[key[1]] = "Bearer "+info[key[1]]
    }
    mdbConn.dbSelect(sql['checkOrg_code'], params)
    .then(() => {
        var params = [info[key[1]]];
        var query = sql[key_value[key[1]]];
        var isValid = "valid";
        if (key[1] == 'AccessToken'){
            isValid = getTokenChk(info['AccessToken'],'access')
            response['rsp_msg'] = "unauthorized_token"
        }
        mdbConn.dbSelect(query, params)
        .then((rows) => {
            if(isValid == "valid" && rows != undefined){
                response['rsp_code'] = "00"
                response['rsp_msg'] = "success"
                Object.assign(response, responseAlpa)
                res.status(200).json(response)
            }
            else{
                response['rsp_code'] = "01"
                res.status(403).json(response)
            }
        })
        .catch(() => {
            response['rsp_code'] = "01"
            res.status(403).json(response)
        })
    })
    .catch(() => {
        response['rsp_code'] = "99"
        response['rsp_msg'] = "fail"
        res.status(403).json(response)
    })
}

function GetListAPI(res,info,params,) {
    var response = {
        'spec_cnt' : 0,
        'spec_list' : ''
    }
    const sql = 'SELECT * FROM data_test WHERE enterprise_code = ? AND data_api = ?'
    mdbConn.dbSelectall(sql, params)
    .then((rows) => {
        response['spec_cnt'] = rows.length;
        for(var i = 0; i < response['spec_cnt']; i++){
            if(params[1] == '[진료정보제공 API] 진료내역 조회 API' || params[1] == '[진료정보제공 API] 처방전교부내역 조회 API'){
                response['spec_list'] += '{' + String(JSON.parse(rows[i]['data_json']).SPEC_ID)+ ',' + String(JSON.parse(rows[i]['data_id'])) + '}'+ ',' + String(JSON.parse(rows[i]['consents'])) + '}'
            }
            else{
                response['spec_list'] += '{' + String(JSON.parse(rows[i]['data_json']).SPEC_ID) + ', ' + String(JSON.parse(rows[i]['consents'])) + '}'
            }
            if( i != response['spec_cnt'])
                response['spec_list'] += ', '
        }
        checkAndAPICall(res,info,response);
    })
    .catch((err) => {
        res.status(404).json({'rsp_code':99, 'rsp_msg':"Not Found API"})
        console.log(err)
    })
}
function GetAPI(res,info,params,addinfo = 'spec'){
    var response = {}
    if (addinfo == 'spec')
        var sql = "SELECT * FROM  data_test WHERE enterprise_code = ? AND json_value(data_json,'$.SPEC_ID') LIKE ? "
    else if (addinfo == 'line')
        var sql = "SELECT * FROM data_test WHERE enterprise_code = ? AND data_id = ?"
    else
        var sql = "SELECT * FROM data_test WHERE enterprise_code = ? AND json_value(data_json,'$.SPEC_ID') like ? AND data_id = ?"
    mdbConn.dbSelect(sql, params)
    .then((rows) => {
        response = JSON.parse(rows['data_json'])
        checkAndAPICall(res,info,response);
    })
    .catch((err) => {
        res.status(404).json({'rsp_code':99, 'rsp_msg':"Not Found SEPC_ID"})
        console.log(err)
    })
}
module.exports = {
    YYYYMMDD : yyyymmdd,
    checkAndAPICall: checkAndAPICall,
    getListAPI: GetListAPI,
    getAPI: GetAPI,
}