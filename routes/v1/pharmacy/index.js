const router = require("express").Router()
const pharmacy = require('./pharmacy')
/**
 * @swagger
 * paths:
 *  /v1/pharmacy/lists:
 *    get:
 *      summary: "의료기관약제내역목록 조회 API"
 *      description: "정정보주체가 특정한 전송요구 내역 조회"
 *      tags: [Pharmacy]
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
 *          description: 정기적/비정기적 전송 API 유형
 *        - in: query
 *          name: org_code
 *          required: true
 *          description: 기관코드
 *        - in: query
 *          name: search_timestamp
 *          required: false
 *          description: 가장 최근 조회한 시간
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
 *                          "의료기관약제내역 수"
 *                    spec_list:
 *                      type: number
 *                      example:
 *                          "{--spec_id, --is_consent}"
 */

router.get("/lists", pharmacy.lists)


/**
 * @swagger
 * paths:
 *  /v1/pharmacy/histories:
 *    post:
 *      summary: "의료기관약제내역 조회 API"
 *      description: "정보주체의 인증 및 전송요구 확인 후 발급"
 *      tags: [Pharmacy]
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
 *          description: 정기적/비정기적 전송 API 유형
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
 *          description: 가장 최근 조회한 시간
 *      responses:
 *        "200":
 *          description: 진료내역 조회 
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
 *                    search_timestamp:
 *                      type: number
 *                      example:
 *                          "조회 타임스탬프"
 *                    prescription_diagnosis_type_code:
 *                      type: number
 *                      example:
 *                          "처방진료구분코드"
 *                    specification_certify_no:
 *                      type: number
 *                      example:
 *                          "처방전교부일자(YYYYMMDD)+일련번호"
 *                    division_type_code:
 *                      type: number
 *                      example:
 *                          "1: 수가 3: 약가 4: 수입, 원료, 조제, 제제 7: 협약, 8: 일반재료"
 *                    division_code:
 *                      type: number
 *                      example:
 *                          "분류코드(수가(행위)코드, 약품코드, 재료대코드)"
 *                    united_division_code:
 *                      type: number
 *                      example:
 *                          "(양방) 1: 수가(상대가치점수표 등록코드), 2: 준용수가, 3: 보험등재약(약제급여목록상한금액표 등록코드), 4: 원료약, 요양기관 자체 조제(제제)약, 5: 보험등재약 일반성분명, 7: 협약재료, 8: 치료재료 
 *                          (한방) A: 수가, B: 준용, C: 약가, G: 협약재료, H: 치료재료, P: 공상
 *                          진료내역의 분류유형과 분류코드를 조합한 코드(구분자+진료내역코드) "
 *                    prescription_certify_organization_code:
 *                      type: number
 *                      example:
 *                          "여덟자리 정수(처방전교부기관코드)"
 *                    pharmacy_division_code:
 *                      type: number
 *                      example:
 *                          "처방전에 의한 조제투약시 처방전의 대체, 변경, 수정 또는 성분 처방을 구분하는 코드"
 *                    medicine_standard_code:
 *                      type: number
 *                      example:
 *                          "의약품표준코드"
 *                    general_name_code:
 *                      type: number
 *                      example:
 *                          "일반명코드"
 *                    whoatc_code:
 *                      type: number
 *                      example:
 *                          "WHOATC코드"
 *                    medicine_effect_division_no:
 *                      type: number
 *                      example:
 *                          "약효분류번호"
 *                    medicine_unit:
 *                      type: number
 *                      example:
 *                          "약품단위"
 *                    unit_price_amount:
 *                      type: number
 *                      example:
 *                          "단가(스무자리 정수)"
 *                    1time_dosage_amount:
 *                      type: number
 *                      example:
 *                          "1회투약량"
 *                    1day_dosage_amount:
 *                      type: number
 *                      example:
 *                          "1일투여량실시횟수"
 *                    treat_start_date:
 *                      type: number
 *                      example:
 *                          "요양개시일자(YYYYMMDD)"
 *                    total_dosage_day:
 *                      type: number
 *                      example:
 *                          "총투여일수실시횟수(다섯자리 정수)"
 *                    price_amount:
 *                      type: number
 *                      example:
 *                          "금액(스무자리 정수)"
 */
router.post('/histories', pharmacy.histories);

/**
 * @swagger
 * paths:
 *  /v1/pharmacy/apis:
 *    get:
 *      summary: "API 목록 조회"
 *      description: "보제공자가 제공하는 정보제공 API 목록을 회신"
 *      tags: [Pharmacy]
 *      parameters:
 *        - in: header
 *          name: x-api-tran-id
 *          required: true
 *          description: 거래고유번호
 *        - in: header
 *          name: x-api-type
 *          required: true
 *          description: 정기적/비정기적 전송 API 유형
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
router.get("/apis", pharmacy.apis)

/**
  * @swagger
  * paths:
  *  /v1/pharmacy/consents:
  *    get:
  *      summary: "전송요구내역 조회 API"
  *      description: "정정보주체가 특정한 전송요구 내역 조회"
  *      tags: [Pharmacy]
  *      parameters:
  *        - in: header
  *          name: x-api-tran-id
  *          required: true
  *          description: 거래고유번호
  *        - in: header
  *          name: x-api-type
  *          required: true
  *          description: 정기적/비정기적 전송 API 유형
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

router.get("/consents", pharmacy.consents)

module.exports = router
