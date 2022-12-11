const {YYYYMMDD, checkAndAPICall, getListAPI,getAPI} = require('../../../controller/controller.js')

/**
   * @path {GET} http://mypd.kr/v1/diagnosis/lists
   * @description 진료내역 목록 조회 API
   */
exports.lists = (req, res) => {
   const info = {
      'org_code' : req.query.org_code,
      //'api_tran_id': req.headers['x-api-tran-id'],
      'AccessToken' : req.headers.authorization
   }
   params = [info['org_code'], '[진료정보제공 API] 진료내역 조회 API']
   getListAPI(res,info,params)
}
/**
   * @path {POST} http://mypd.kr/v1/diagnosis/histories
   * @description 진료내역 조회 API
   */
exports.histories = (req, res) => {
   const info = {
      'org_code' : req.query.org_code,
      'AccessToken' : req.headers.authorization,
      'spec_id' : req.query.spec_id,
      'line_no' : req.query.line_no
   }
   params = [info['org_code'], info['spec_id'], info['line_no']] // 줄 번호????
   getAPI(res,info,params,'Spec&Line')
}
/**
   * @path {GET} http://mypd.kr/v1/diagnosis/presciptions
   * @description 처방전교부목록 조회 API
   */
exports.presciptions = (req, res) => {
   const info = {
      'org_code' : req.query.org_code,
      'AccessToken' : req.headers.authorization
   }
   params = [info['org_code'], "[진료정보제공 API] 처방전교부내역 조회 API"]
   getListAPI(res,info,params)
}
/**
   * @path {POST} http://mypd.kr/v1/diagnosis/certifications
   * @description 처방전교부내역 조회 API
   */
exports.certifications = (req, res) => {
   const info = {
      'org_code' : req.query.org_code,
      'AccessToken' : req.headers.authorization,
      'spec_id' : req.query.spec_id, //JSON 안 SPEC_ID
      'pres_certify_no' :  req.query.pres_certify_no // data_id
   }
   params = [info['org_code'], info['spec_id'], info['pres_certify_no'] ] // 처방전교부번호 ?
   getAPI(res,info,params,'Spec&Line')
}
/**
   * @path {POST} http://mypd.kr/v1/diagnosis/patients
   * @description 수진자상병내역 조회 API
   */
exports.patients = (req, res) => {
   const info = {
      'org_code' : req.query.org_code,
      'AccessToken' : req.headers.authorization,
      'patient_discrimination_no' : req.query.patient_discrimination_no //data_id
   }
   params = [info['org_code'], info['patient_discrimination_no']]
   getAPI(res,info,params,'line')
}
/**
   * @path {GET} http://mypd.kr/v1/diagnosis/apis
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
   params = [info['org_code'], "[진료정보제공 API] API 목록 조회"]
   mdbConn.dbSelectall(sql, params)
   .then((rows) => {
      response['api_cnt'] = rows.length;
      for(var i = 0; i < response['api_cnt']; i++){
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
   * @path {GET} http://mypd.kr/v1/diagnosis/consents
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