const router = require("express").Router()
const specification = require('./specification');
/**
 * @swagger
 * paths:
 *  /v1/specification/lists:
 *    get:
 *      summary: "명세서 목록 조회 API"
 *      description: "정보주체의 인증 및 전송요구 확인 후 발급"
 *      tags: [Specification]
 *      security:  
 *        - Authorization: []
 *      parameters:
 *        - in: header
 *          name: x-api-tran-id
 *          required: true
 *          description: 거래고유번호
 *        - in: header
 *          name: x-api-type
 *          required: true
 *          schema:
 *            type: string
 *            example: false
 *            enum: 
 *              - True 
 *              - False
 *        - in: query
 *          name: org_code
 *          required: true
 *          description: 기관코드
 *        - in: query
 *          name: search_timestamp
 *          required: true
 *          allowEmptyValue: true
 *          description: 가장 최근 조회한 시간
 *      responses:
 *        "200":
 *          description: 명세서 목록 조회
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    rsp_code:
 *                      type: number
 *                      example:
 *                          "00: 성공, 01: 유효하지않은 접근토큰, 99: 실패"
 *                    rsp_msg:
 *                      type: string
 *                      example:
 *                          "success: 성공, unauthorized_token: 유효하지않은 접근토큰 fail: 실패"
 *                    search_timestamp:
 *                      type: number
 *                      example:
 *                          "YYYYMMDDHHMM"
 *                    spec_cnt:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    spec_list:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 */

router.get("/lists", specification.lists)

/**
 * @swagger
 * paths:
 *  /v1/specification/specifics:
 *    post:
 *      summary: "명세서 내역 조회 API"
 *      description: "정보주체의 인증 및 전송요구 확인 후 발급"
 *      tags: [Specification]
 *      security:  
 *        - Authorization: []
 *      parameters:
 *        - in: header
 *          name: x-api-tran-id
 *          required: true
 *          description: 거래고유번호
 *        - in: header
 *          name: x-api-type
 *          required: true
 *          schema:
 *            type: string
 *            example: false
 *            enum: 
 *              - True 
 *              - False
 *        - in: query
 *          name: org_code
 *          required: true
 *          description: 기관코드
 *        - in: query
 *          name: spec_id
 *          required: true
 *          description: 명세서 ID
 *        - in: query
 *          name: search_timestamp
 *          required: false
 *          allowEmptyValue: true
 *          description: 가장 최근 조회한 시간
 *      responses:
 *        "200":
 *          description: 명세서 내역 조회
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    rsp_code:
 *                      type: number
 *                      example:
 *                          "세부 응답코드 : 00: 성공, 01: 유효하지않은 접근토큰, 99: 실패"
 *                    rsp_msg:
 *                      type: string
 *                      example:
 *                          "세부 응답메시지 : success: 성공, unauthorized_token: 유효하지않은 접근토큰 fail: 실패"
 *                    search_timestamp:
 *                      type: number
 *                      example:
 *                          "조회 타임스탬프 : YYYYMMDDHHMM"
 *                    IDV_ID:
 *                      type: string
 *                      example:
 *                          "수진자이름 : 10자리 문자"
 *                    AGE_GROUP:
 *                      type: number
 *                      example:
 *                          "수진자연령 : 세자리 정수"
 *                    SEX:
 *                      type: number
 *                      example:
 *                          "성별구분코드 : 1: 남자, 2: 여자, 9: 구분오류"
 *                    FORM_CD:
 *                      type: number
 *                      example:
 *                          "서식구분코드 : 021: 의과입원 031: 의과외래 041: 치과입원 051: 치과외래 071: 보건기관입원의과 072: 보건기관입원치과 073: 보건기관입원한방 081: 보건기관외래의과 082: 보건기관외래치과 083: 보건기관외래한방 091: 정신과낮병동 101: 정신과입원 111: 정신과외래 121: 한방입원 131: 한방외래 201: 직접조제 211: 처방조제 061: 조산원입원, 991: 조산원외래"
 *                    CL_CD:
 *                      type: number
 *                      example:
 *                          "종별코드 : 01: 상급종합병원, 11: 종합병원, 21: 병원, 28: 요양병원, 29: 정신병원, 31: 의원, 41: 치과병원, 51: 치과의원, 61: 조산원, 71: 보건소, 72: 보건지소, 73: 보건진료소, 74: 모자보건센타, 75: 보건의료원, 81: 약국, 91: 한방종합병원, 92: 한방병원, 93: 한의원, 94: 한약방"
 *                    MAIN_SICK:
 *                      type: string
 *                      example:
 *                          "주상병코드 : 자릿수1 - A: 서식이 보건기관이고 진료과가 한방이 아닌 경우이거나 B, C가 아닌경우 B: 서식이 보건기관이고 진료과가 한방인 경우이거나 서식이 한방인 경우 C: 서식이 직접조제인 경우 $:상병기호가 ''이거나 코드값이 없는 경우 발생 자릿수2-6 - 주된 상병분류기호(약국 증상분류기호, 한방상병코드, 의과:표준질병사인분류코드)"
 *                    SUB_SICK:
 *                      type: number
 *                      example:
 *                          "{(부상병코드)\"second_diagnosis_code\"...} : dw_main_diagnosis_code 동일"
 *                    DSBJT_CD:
 *                      type: number
 *                      example:
 *                          "진료과목코드 : 00: 일반의, 01: 내과, 02: 신경과, 03: 정신건강의학과, 04: 외과, 05: 정형외과, 06: 신경외과, 07: 흉부외과, 08: 성형외과, 09: 마취통증의학과, 10: 산부인과, 11: 소아청소년과, 12: 안과, 13: 이비인후과, 14: 피부과, 15: 비뇨의학과, 16: 영상의학과, 17: 방사선종양학과, 18: 병리과, 19: 진단검사의학과, 20: 결핵과, 21: 재활의학과, 22: 핵의학과, 23: 가정의학과, 24: 응급의학과, 25: 직업환경의학과, 26: 예방의학과, 27: 기타1(치과), 28: 기타4(한방), 31: 기타2, 40: 기타2, 41: 보건, 42: 기타3, 43: 보건기관치과, 44: 보건기관한방, 49: 치과, 50: 구강악안면외과, 51: 치과보철과, 52: 치과교정과, 53: 소아치과, 54: 치주과, 55: 치과보존과, 56: 구강내과, 57: 영상치의학과, 58: 구강병리과, 59: 예방치과, 60: 치과소계, 61: 통합치의학과, 80: 한방내과, 81: 한방부인과"
 *                    PRCL_SYM_TP_CD:
 *                      type: number
 *                      example:
 *                          "특정기호구분코드 : https://m.blog.naver.com/ashlee78/221358295810"
 *                    INJ_EXA_TP_CD:
 *                      type: number
 *                      example:
 *                          " 상해외인구분코드 https://blog.naver.com/39954/222059621563"
 *                    OINJ_TP_CD:
 *                      type: number
 *                      example:
 *                          "공상구분코드 : 0: 정상건, 1: 공상건(공교공단), 3: 보훈감면30%(광주민주유공자), 4: 보훈국비(건강보험,의료급여), 5: 보훈감면50%, 6: 보훈감면60%, 7: 보훈국비(상이처,무자격자), 8: 군인가족,예비역장군 등 대상(공교공단,직장,지역분), 9: 군인,군무원 대상 (공교공당분), B: 보훈병원(상이처,무자격자/보험급여1차), D: 보훈병원(보험급여2차), C: 차상위 본인부담 경감대상자, E: 차상위 만성질환 18세미만 본인부담 경감대상자, F: 차상위 장애인 만성질환 18세미만 본인부담 경감대상자, H: 희귀난치성질환자 지원대상자"
 *                    DGRSLT_TP_CD:
 *                      type: number
 *                      example:
 *                          "진료결과구분코드 : 1: 계속, 2: 이송, 3: 회송, 4: 사망, 5: 기타, 9: 퇴원"
 *                    RECU_FR_DT:
 *                      type: number
 *                      example:
 *                          "요양개시일자 : YYYYMMDD"
 *                    RECN:
 *                      type: number
 *                      example:
 *                          "내원일수 : 다섯자리 정수"
 *                    DMD_YPAY_XPNS_TOT_AMT:
 *                      type: number
 *                      example:
 *                          "청구요양급여비용총금액 : 스무자리 정수"
 */

router.post("/specifics", specification.specifics);

/**
 * @swagger
 * paths:
 *  /v1/specification/apis:
 *    get:
 *      summary: "API 목록 조회"
 *      description: "보제공자가 제공하는 정보제공 API 목록을 회신"
 *      tags: [Specification]
 *      parameters:
 *        - in: header
 *          name: x-api-tran-id
 *          required: true
 *          description: 거래고유번호
 *        - in: header
 *          name: x-api-type
 *          required: true
 *          schema:
 *            type: string
 *            example: false
 *            enum: 
 *              - True 
 *              - False
 *        - in: query
 *          name: org_code
 *          required: true
 *          description: 기관코드
 *        - in: query
 *          name: client_id
 *          required: true
 *          description: 클라이언트 식별값
 *      responses:
 *        "200":
 *          description: API 목록 조회
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    rsp_code:
 *                      type: number
 *                      example:
 *                          "세부 응답코드"
 *                    rsp_msg:
 *                      type: string
 *                      example:
 *                          "세부 응답메시지"
 *                    version:
 *                      type: number
 *                      example:
 *                          "현재 버전"
 *                    min_version:
 *                      type: number
 *                      example:
 *                          "호환가능 최소 버전"
 *                    api_cnt:
 *                      type: number
 *                      example:
 *                          "API 개수"
 *                    api_list:
 *                      type: number
 *                      example:
 *                          "{API 목록(\"--api_code\":API 구분 코드, \"--api_uri\":해당하는 정보)}"
 */

router.get("/apis", specification.apis)

/**
 * @swagger
 * paths:
 *  /v1/specification/consents:
 *    get:
 *      summary: "전송요구내역 조회 API"
 *      description: "정정보주체가 특정한 전송요구 내역 조회"
 *      tags: [Specification]
 *      security:  
 *        - Authorization: []
 *      parameters:
 *        - in: header
 *          name: x-api-tran-id
 *          required: true
 *          description: 거래고유번호
 *        - in: header
 *          name: x-api-type
 *          required: true
 *          schema:
 *            type: string
 *            example: false
 *            enum: 
 *              - True 
 *              - False
 *        - in: query
 *          name: org_code
 *          required: true
 *          description: 기관코드
 *      responses:
 *        "200":
 *          description: 전송요구내역 조회
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    rsp_code:
 *                      type: number
 *                      example:
 *                          "123456789"
 *                    rsp_msg:
 *                      type: string
 *                      example:
 *                          "0123456789abcdef0123456789abcdef01234567"
 *                    is_scheduled:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    fnd_cycle:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    add_cycle:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    end_date:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    purpose:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    period:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 */

router.get("/consents", specification.consents)
module.exports = router
