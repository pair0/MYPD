const {YYYYMMDD, checkAndAPICall} = require('../../../controller/controller.js')

/**
   * @path {GET} http://localhost:3000/v1/specification/lists
   * @description 명세서 목록 조회 API
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
        "spec_list": '{명세서 목록(--spec_id(차세대 시스템에서 명세서를 유일하게 식별하기 위해 부여 되는 인조식별자, NUMBER), --is_consent)}'
        // 명세서 수, 명세서 목록 정의??????
    }
    checkAndAPICall(res,info,response);
}
/**
   * @path {POST} http://localhost:3000/v1/specification/specifics
   * @description 명세서 목록 조회 API
   */
exports.specifics = (req, res) => {
    const info = {
        'org_code' : req.query.org_code,
        'AccessToken' : req.headers.authorization
    }
    var response = {
        "rsp_code": "00", //00: 성공, 01: 유효하지않은 접근토큰, 99: 실패
        "rsp_msg": "success", //success: 성공, unauthorized_token: 유효하지않은 접근토큰 fail: 실패
        "search_timestamp": YYYYMMDD(new Date().getTime()), //YYYYMMDDHHMM
        "IDV_ID": "1234123", // 10자리 숫자 주민등록번호 익명화
        "AGE_GROUP": "6", // 수진자연령(두자리 정수)
        "SEX": "1",// 성별 구분 코드 1: 남자, 2: 여자, 9: 구분오류
        "FORM_CD": "21", // 021: 의과입원 031: 의과외래 041: 치과입원 051: 치과외래 071: 보건기관입원의과 072: 보건기관입원치과 073: 보건기관입원한방 081: 보건기관외래의과 082: 보건기관외래치과 083: 보건기관외래한방 091: 정신과낮병동 101: 정신과입원 111: 정신과외래 121: 한방입원 131: 한방외래 201: 직접조제 211: 처방조제 061: 조산원입원, 991: 조산원외래
        "CL_CD": "11", // 01: 상급종합병원, 11: 종합병원, 21: 병원, 28: 요양병원, 29: 정신병원, 31: 의원, 41: 치과병원, 51: 치과의원, 61: 조산원, 71: 보건소, 72: 보건지소, 73: 보건진료소, 74: 모자보건센타, 75: 보건의료원, 81: 약국, 91: 한방종합병원, 92: 한방병원, 93: 한의원, 94: 한약방
        "MAIN_SICK": "S96", // 주상병코드
        "SUB_SICK": ' S93', // 부상병코드
        "DSBJT_CD": "5", // 00: 일반의, 01: 내과, 02: 신경과, 03: 정신건강의학과, 04: 외과, 05: 정형외과, 06: 신경외과, 07: 흉부외과, 08: 성형외과, 09: 마취통증의학과, 10: 산부인과, 11: 소아청소년과, 12: 안과, 13: 이비인후과, 14: 피부과, 15: 비뇨의학과, 16: 영상의학과, 17: 방사선종양학과, 18: 병리과, 19: 진단검사의학과, 20: 결핵과, 21: 재활의학과, 22: 핵의학과, 23: 가정의학과, 24: 응급의학과, 25: 직업환경의학과, 26: 예방의학과, 27: 기타1(치과), 28: 기타4(한방), 31: 기타2, 40: 기타2, 41: 보건, 42: 기타3, 43: 보건기관치과, 44: 보건기관한방, 49: 치과, 50: 구강악안면외과, 51: 치과보철과, 52: 치과교정과, 53: 소아치과, 54: 치주과, 55: 치과보존과, 56: 구강내과, 57: 영상치의학과, 58: 구강병리과, 59: 예방치과, 60: 치과소계, 61: 통합치의학과, 80: 한방내과, 81: 한방부인과
        "PRCL_SYM_TP_CD": "-", // https://m.blog.naver.com/ashlee78/221358295810
        "INJ_EXA_TP_CD": "상해외인구분코드", // https://blog.naver.com/39954/222059621563
        "OINJ_TP_CD": "C", // 0: 정상건, 1: 공상건(공교공단), 3: 보훈감면30%(광주민주유공자)
        "DGRSLT_TP_CD": "9", // 1: 계속, 2: 이송, 3: 회송, 4: 사망, 5: 기타, 9: 퇴원
        "RECU_FR_DT": "20201010", // YYYYMMDD
        "RECN": "15", // 다섯자리 정수
        "DMD_YPAY_XPNS_TOT_AMT": "789200" // 스무자리 정수
    }
    checkAndAPICall(res,info,response);
}

/**
   * @path {GET} http://localhost:3000/v1/specification/apis
   * @description 정보제공자가 제공하는 정보제공 API 목록을 회신
   */
exports.apis = (req, res) => {
    const info = {
        'org_code' : req.query.org_code,
        'client_id': req.query.client_id
    }
    var response = {
        "rsp_code" : "세부 응답코드", 
        "rsp_msg" : "Incorrect Client ID",
        "VERSION" : "현재 버전",
        "MIN_VERSION" : "호환가능 최소 버전",
        "API_CNT" : "API 개수",
        "API_LIST" : '{API 목록("--api_code":API 구분 코드, "--api_uri":해당하는 정보)}'
    }
    checkAndAPICall(res,info,response);
}
/**
   * @path {GET} http://localhost:3000/v1/specification/consents
   * @description 정보주체가 특정한 전송요구 내역 조회
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