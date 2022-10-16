const {YYYYMMDD, checkAndAPICall} = require('../../../controller/controller.js')

/**
   * @path {GET} http://localhost:3000/v1/pharmacy/lists
   * @description 의료기관약제내역목록 조회 API
   */
exports.lists = (req, res) => {
    const info = {
        'org_code' : req.query.org_code,
        // 'api_tran_id': req.headers['x-api-tran-id'],
        'AccessToken' : req.headers.authorization
    }
    var response = {
        "rsp_code": "00", //00: 성공, 01: 유효하지않은 접근토큰, 99: 실패
        "rsp_msg": "success", //success: 성공, unauthorized_token: 유효하지않은 접근토큰 fail: 실패
        "search_timestamp": YYYYMMDD(new Date().getTime()), //YYYYMMDDHHMM
        "spec_cnt": "명세서 수 (10)",
        "spec_list": "{--spec_id(차세대 시스템에서 명세서를 유일하게 식별하기 위해 부여 되는 인조식별자, NUMBER), --is_consent}"
        // 명세서 수, 명세서 목록 정의??????
    }
    checkAndAPICall(res, info,response);
}
/**
   * @path {POST} http://localhost:3000/v1/pharmacy/histories
   * @description 의료기관약제내역 조회 API
   */
exports.histories = (req, res) => {
    const info = {
        'org_code' : req.query.org_code,
        // 'api_tran_id': req.headers['x-api-tran-id'],
        'AccessToken' : req.headers.authorization
    }
    var response = {
        "rsp_code": "00", //00: 성공, 01: 유효하지않은 접근토큰, 99: 실패
        "rsp_msg": "success", //success: 성공, unauthorized_token: 유효하지않은 접근토큰 fail: 실패
        "search_timestamp": YYYYMMDD(new Date().getTime()), //YYYYMMDDHHMM
        "prescription_diagnosis_type_code_cnt": "명세처방진료구분코드서",
        "specification_certify_no": "처방전교부번호",
        "division_type_code" : "분류유형코드",
        "division_code" : "분류코드(수가(행위)코드, 약품코드, 재료대코드)",
        "united_division_code" : "통합분류코드",
        "prescription_certify_organization_code" : "처방전교부기관코드",
        "pharmacy_division_code" : "조제구분코드",
        "medicine_standard_code" : "의약품표준코드",
        "general_name_code" : "일반명코드",
        "whoatc_code" : "WHOATC코드",
        "medicine_effect_division_no" : "약효분류번호",
        "medicine_unit" : "약품단위",
        "unit_price_amount" : "단가",
        "1time_dosage_amount" : "회투약량",
        "1day_dosage_amount" : "일투여량실시횟수",
        "treat_start_date" : "요양개시일자",
        "total_dosage_day" : "총투여일수실시횟수",
        "price_amount" : "금액",
        // 명세서 수, 명세서 목록 정의??????
    }
    checkAndAPICall(res, info,response);
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
        "rsp_code" : "세부 응답코드", 
        "rsp_msg" : "Incorrect Client ID",
        "version" : "현재 버전",
        "min_version" : "호환가능 최소 버전",
        "api_cnt" : "API 개수",
        "api_list" : '{API 목록("--api_code":API 구분 코드, "--api_uri":해당하는 정보)}'
    }
    checkAndAPICall(res,info,response);
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
        "rsp_code" : "세부 응답코드", 
        "rsp_msg" : "세부 응답메시지",
        "is_scheduled" : "정기적 전송 여부",
        "fnd_cycle" : "전송 주기(기본정보)",
        "add_cycle" : "전송 주기(추가정보)",
        "end_date" : "종료시점",
        "purpose" : "목적",
        "period" : "보유기간"
    }
    checkAndAPICall(res,info,response);
}