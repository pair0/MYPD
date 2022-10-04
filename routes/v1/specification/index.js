const router = require("express").Router()
const specification = require('./specification');
/**
 * @swagger
 * paths:
 *  /v1/specification/lists:
 *    get:
 *      summary: "명세서 목록 조회 API"
 *      description: "정보주체의 인증 및 전송요구 확인 후 발급"
 *      tags: [InformationProvision]
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          required: true
 *          description: 접근토큰
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
 *          required: true
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
 *                          "123456789"
 *                    rsp_msg:
 *                      type: string
 *                      example:
 *                          "0123456789abcdef0123456789abcdef01234567"
 *                    search_timestamp:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
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
 *      tags: [InformationProvision]
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          required: true
 *          description: 접근토큰
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
 *          required: true
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
 *                          "123456789"
 *                    rsp_msg:
 *                      type: string
 *                      example:
 *                          "0123456789abcdef0123456789abcdef01234567"
 *                    search_timestamp:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    patient_name:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    patient_age:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    sex_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    format_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    hospital_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    dw_main_diagnosis_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    sub_diagnosis_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    diagnosis_department_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    specific_sign_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    wound_external_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    civil_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    diagnosis_result_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    treatment_commerce_date:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    visit_days_num:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    treatment_total_payment:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 */

router.post("/specifics", specification.specifics);

/**
 * @swagger
 * paths:
 *  /v1/specification/apis:
 *    get:
 *      summary: "API 목록 조회"
 *      description: "보제공자가 제공하는 정보제공 API 목록을 회신"
 *      tags: [InformationProvision]
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
 *          description: 명세서 목록 조회
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
 *                    version:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    min_version:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    api_cnt:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    api_list:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 */

router.get("/apis", specification.apis)


module.exports = router
