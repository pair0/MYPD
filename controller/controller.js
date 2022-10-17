const {getTokenChk} = require("../passport/abouttoken");
const mdbConn = require('../db_connection/mariaDBConn')

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
    else
        time = yyyy + mm + dd
    return time;
}
// info_key = ['AccessToken']
// info_key = ['client_id']

function checkAndAPICall(res, info, response){
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
    const key = Object.keys(info);
    var params = [info['org_code']];
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

module.exports = {
    YYYYMMDD : yyyymmdd,
    checkAndAPICall: checkAndAPICall
}