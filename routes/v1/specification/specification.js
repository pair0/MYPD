const {YYYYMMDD, checkAndAPICall, getListAPI, getAPI} = require('../../../controller/controller.js')
const mdbConn = require('../../../db_connection/mariaDBConn')

/**
   * @path {GET} https://mypd.kr/v1/specification/lists
   * @description 명세서 목록 조회 API
   */
exports.lists = (req, res) => {
    const info = {
        'org_code' : req.query.org_code,
        'AccessToken' : req.headers.authorization
    }
    var params = [info['org_code'], "[의료명세서 API] 명세서 내역 조회 API"]
    getListAPI(res,info,params)
}
/**
   * @path {POST} https://mypd.kr/v1/specification/specifics
   * @description 명세서 목록 조회 API
   */
exports.specifics = (req, res) => {
    const info = {
        'org_code' : req.query.org_code,
        'AccessToken' : req.headers.authorization,
        'spec_id' : req.query.spec_id
    }
    params = [info['org_code'], info['spec_id']]
    getAPI(res,info, params);
}
/**
   * @path {GET} https://mypd.kr/v1/specification/apis
   * @description 정보제공자가 제공하는 정보제공 API 목록을 회신
   */
exports.apis = (req, res) => {
    const info = {
        'org_code' : req.query.org_code,
        'client_id': req.query.client_id
    }
    var response = {
        "VERSION" : "v3.2.1",
        "MIN_VERSION" : "v3.0.0",
        'api_list' : ''
    }
    const sql = 'SELECT * FROM data_test WHERE enterprise_code = ? and data_api = ?'
    params = [info['org_code'], "[의료명세서 API] API 목록 조회"]
    mdbConn.dbSelectall(sql, params)
    .then((rows) => {
        // response += String(JSON.parse(rows['data_json']))
        response['api_cnt'] = rows.length;
        for(var i = 0; i < response['api_cnt']; i++){
            // response['spec_list'] += String(JSON.parse(rows[i]['data_json']).IDV_ID) + ', ' 
            response['api_list'] += '{' +  String(JSON.parse(rows[i]['api_code'])) + ', ' + String(JSON.parse(rows[i]['api_uri']))
            if( i != response['api_cnt'])
                response['api_list'] += ', '
        }
        // Object.assign(response, JSON.parse(rows['data_json']))
        checkAndAPICall(res,info,response);
    })
    .catch((err) => {
        console.log(err)
    })
}
/**
   * @path {GET} https://mypd.kr/v1/specification/consents
   * @description 정보주체가 특정한 전송요구 내역 조회
   */
exports.consents = (req, res) => {
    const info = {
        'org_code' : req.query.org_code,
        'AccessToken' : req.headers.authorization,
        'x-api-type' : req.headers.x-api-type
    }
    var response = {
        "is_scheduled" : info['x-api-type'],
        "end_date" : Number(YYYYMMDD(new Date().getTime())) + 7,
        "purpose" : "정보 갱신",
        "period" : Number(YYYYMMDD(new Date().getTime())) + 7
    }
    if (info['x-api-type'] == 'true'){
        response['fnd_cycle'] = '1W'
        response['add_cycle'] = '1D'
    }
    checkAndAPICall(res,info,response);
}