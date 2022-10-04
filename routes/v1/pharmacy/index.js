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

router.get("/lists", pharmacy.lists)


/**
 * @swagger
 * paths:
 *  /v1/pharmacy/histories:
 *    post:
 *      summary: "의료기관약제내역 조회 API"
 *      description: "정보주체의 인증 및 전송요구 확인 후 발급"
 *      tags: [Pharmacy]
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
 *                          "123456789"
 *                    rsp_msg:
 *                      type: string
 *                      example:
 *                          "0123456789abcdef0123456789abcdef01234567"
 *                    search_timestamp:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    prescription_diagnosis_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    specification_certify_no:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    division_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    division_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    united_division_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    prescription_certify_organization_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    pharmacy_division_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    medicine_standard_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    general_name_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    whoatc_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    medicine_effect_division_no:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    medicine_unit:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    unit_price_amount:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    1time_dosage_amount:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    1day_dosage_amount:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    treat_start_date:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    total_dosage_day:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    price_amount:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 */
router.post('/histories', pharmacy.histories);

module.exports = router