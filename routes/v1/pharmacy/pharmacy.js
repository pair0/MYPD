const {YYYYMMDD, checkAndAPICall, getListAPI, getSpecAPI} = require('../../../controller/controller.js')

/**
   * @path {GET} http://localhost:3000/v1/pharmacy/lists
   * @description 의료기관약제내역목록 조회 API
   */
exports.lists = (req, res) => {
    const info = {
        'org_code' : req.query.org_code,
        'AccessToken' : req.headers.authorization
    }
    params = [info['org_code'], "[의약품정보제공 API] 의료기관약제내역목록 조회 API"]
    getListAPI(res,info,params)
}
/**
   * @path {POST} http://localhost:3000/v1/pharmacy/histories
   * @description 의료기관약제내역 조회 API
   */
exports.histories = (req, res) => {
    const info = {
        'org_code' : req.query.org_code,
        'AccessToken' : req.headers.authorization,
        'spec_id' : req.query.spec_id
    }
    params = [info['org_code'], info['spec_id']]
    getSpecAPI(res,info,params)
}
/**
   * @path {GET} http://localhost:3000/v1/pharmacy/apis
   * @description API 목록 조회
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
    params = [info['org_code'], "[의약품정보제공 API] API 목록 조회"]
    mdbConn.dbSelectall(sql, params)
    .then((rows) => {
        response['api_cnt'] = rows.length;
        for(var i = 0; i < response['api_cnt']; i++){
            // response['spec_list'] += String(JSON.parse(rows[i]['data_json']).IDV_ID) + ', ' 
            response['api_list'] += '{' +  String(JSON.parse(rows[i]['api_code'])) + ', ' + String(JSON.parse(rows[i]['api_uri']))
            if( i != response['api_cnt'])
                response['api_list'] += ', '
        }
        checkAndAPICall(res,info,response);
    })
    .catch((err) => {
        console.log(err)
    })
}
/**
    * @path {GET} http://localhost:3000/v1/pharmacy/consents
    * @description API 목록 조회
    */
exports.consents = (req, res) => {
    const info = {
        'org_code' : req.query.org_code,
        'AccessToken' : req.headers.authorization
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