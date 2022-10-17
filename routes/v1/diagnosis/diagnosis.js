const {YYYYMMDD, checkAndAPICall} = require('../../../controller/controller.js')

/**
   * @path {GET} http://localhost:3000/v1/diagnosis/lists
   * @description 진료내역 목록 조회 API
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
      "spec_cnt": "명세서 수",
      "spec_list": "{진료내역 목록(진료식별자세트{--spec_id, --line_no} --is_consent)}"
      // 명세서 수, 명세서 목록 정의??????
   }
   checkAndAPICall(res, info,response);
}
/**
   * @path {POST} http://localhost:3000/v1/diagnosis/histories
   * @description 진료내역 조회 API
   */
exports.histories = (req, res) => {
   const info = {
      'org_code' : req.query.org_code,
      'AccessToken' : req.headers.authorization
   }
   var response = {
      "rsp_code": "00", //00: 성공, 01: 유효하지않은 접근토큰, 99: 실패
      "rsp_msg": "success", //success: 성공, unauthorized_token: 유효하지않은 접근토큰 fail: 실패
      "search_timestamp": YYYYMMDD(new Date().getTime()), //YYYYMMDDHHMM
      "division_type_code": "분류유형코드", // 10자리 문자
      "division_code": "분류코드(수가(행위)코드, 약품코드, 재료대코드)",
      "main_division_code": "주분류코드(구분코드(DIV_CD)에서 산정코드를 제외한 수가 기본코드)",
      "united_division_code": "서식구분코드", // 1: 수가(상대가치점수표 등록코드), 2: 준용수가, 3: 보험등재약(약제급여목록상한금액표 등록코드), 4: 원료약, 요양기관 자체 조제(제제)약, 5: 보험등재약 일반성분명, 7: 협약재료, 8: 치료재료 한방 A: 수가, B: 준용, C: 약가, G: 협약재료, H: 치료재료, P: 공상option_division_code -I : 기본진료료, 약제, 치료재료, 위탁검사 및 혈액료 등 상대가치점수표상의 요양기관 종별가산율이 적용되지 아니한 항목 II : 요양기관 종별가산율이 적용되는 진료행위 항목medicine_standard_code
      "option_division_code": "1란2란구분코드",
      "medicine_standard_code": "의약품표준코드", // (13자리) : 국가식별코드(3) + 업체식별코드(4) + 품종코드(함량포함한 품목코드 + 포장단뒤)(5) + 검증번호(1)
      "general_name_code": '일반명코드', // (9자리)) : 주성분 일련번호(4) + 함량 일련번호(2) + 투여경로(1) + 제형(2)
      "whoatc_code": "WHOATC코드", // (7자리 or 5자리) : 해부학적 그룹(1) + 치료적 그룹(2) + 치료적 하위그룹(4) + 화학적/치료적/약물학적 하위그룹(1) + 화학물질(2)
      "unit_price_amount": "단가", // (20자리 정수)
      "unit_dosage_amount": "1회투약량", 
      "day_dosage_amount": "1일투여량실시횟수",
      "total_dosage_day": "총투여일수실시횟수", // 5자리 정수
      "price_amount": "금액", // 20자리 정수
   }
   checkAndAPICall(res,info,response);
}
/**
   * @path {GET} http://localhost:3000/v1/diagnosis/presciptions
   * @description 처방전교부목록 조회 API
   */
exports.presciptions = (req, res) => {
   const info = {
      'org_code' : req.query.org_code,
      'AccessToken' : req.headers.authorization
   }
   var response = {
      "rsp_code": "00", //00: 성공, 01: 유효하지않은 접근토큰, 99: 실패
      "rsp_msg": "success", //success: 성공, unauthorized_token: 유효하지않은 접근토큰 fail: 실패
      "search_timestamp": YYYYMMDD(new Date().getTime()), //YYYYMMDDHHMM
      "specification_cnt": "처방전교부내역 수",
      "specification_list": "{처방전교부내역 목록(처방전식별자세트{--spec_id, --pres_certify_no}, --is_consent)}",
   }
   checkAndAPICall(res,info,response);
}
/**
   * @path {POST} http://localhost:3000/v1/diagnosis/certifications
   * @description 처방전교부내역 조회 API
   */
exports.certifications = (req, res) => {
   const info = {
      'org_code' : req.query.org_code,
      'AccessToken' : req.headers.authorization
   }
   var response = {
      "rsp_code": "00", //00: 성공, 01: 유효하지않은 접근토큰, 99: 실패
      "rsp_msg": "success", //success: 성공, unauthorized_token: 유효하지않은 접근토큰 fail: 실패
      "search_timestamp": YYYYMMDD(new Date().getTime()), //YYYYMMDDHHMM
      "patient_discrimination_no": "수진자개인식별번호",
      "patient_type_code": 1, //1: 일반, 2: 신생아, 3: 행려, 4: 외국인, 5: 외국인(신생아), 6: 불명
      "insurer_type_code": 4, // 4: 건강보험, 5:의료급여, 7: 보훈(상이처,무자격자), 9: 무료진료
      "patient_age": 25, // 3자리 정수
      "sex_type_code": 1, // 1: 남, 2: 여, 9: 성별구분오류 
      "insured_type_code": 2, // 1: 피보험자, 2: 피부양자
      "treat_organization_sign": "요양기관기호", // 1~2자리: 지역별, 3자리: 종별, 4~7자리: 일련번호, 8자리: 전산체크번호
      "prescription_certify_organization_code": "처방전교부기관코드", // 1~2자리: 지역별, 3자리: 종별, 4~7자리: 일련번호, 8자리: 전산체크번호
      "prescription_specific_sign_type_code": "처방전특정기호구분코드", // 4자리 char(?)
      "direct_prescription_pharmacy_type_code": "D", // D: 직접조제, S: 대체조제
      "treat_start_date": "요양개시일자", // YYYYMMDD
      "prescription_certify_date": "처방전교부일자", // YYYYMMDD
      "prescription_dosage_day": "처방투약일수", // 5자리 정수
      "pharmacy_availability": "반복조제가능횟수", // 5자리 정수
      "usage_period_day": "사용기간일수" // 5자리 정수
   }
   checkAndAPICall(res,info,response);
}
/**
   * @path {POST} http://localhost:3000/v1/diagnosis/patients
   * @description 수진자상병내역 조회 API
   */
exports.patients = (req, res) => {
   const info = {
      'org_code' : req.query.org_code,
      'AccessToken' : req.headers.authorization
   }
   var response = {
      "rsp_code": "00", //00: 성공, 01: 유효하지않은 접근토큰, 99: 실패
      "rsp_msg": "success", //success: 성공, unauthorized_token: 유효하지않은 접근토큰 fail: 실패
      "search_timestamp": YYYYMMDD(new Date().getTime()), //YYYYMMDDHHMM
      "sick_no": "조회 타임스탬프",
      "sick_code": "상병코드", 
      "demand_sick_sign": "청구상병기호", 
      "demand_diagnosis_department_code": "청구진료과목코드", 
      "internal_detail_department_code": "내과세부전문과목코드",
      "demand_specific_sign_type_code": "청구특정기호구분코드", 
      "demand_wound_external_type_code": "청구상해외인구분코드", 
      "sick_classification_category_code": "상병분류유형코드", 
   }
   checkAndAPICall(res,info,response);
}
/**
   * @path {GET} http://localhost:3000/v1/diagnosis/apis
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
   * @path {GET} http://localhost:3000/v1/diagnosis/consents
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