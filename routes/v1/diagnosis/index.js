const router = require("express").Router()
const diagnosis = require('./diagnosis')
/**
 * @swagger
 * paths:
 *  /v1/diagnosis/lists:
 *    get:
 *      summary: "진료내역 목록 조회 API"
 *      description: "정정보주체가 특정한 전송요구 내역 조회"
 *      tags: [Diagnosis]
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
 *          description: 진료내역 목록 조회
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
 *                    diagnosis_cnt:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    diagnosis_list:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 */

router.get('/lists',diagnosis.lists)

/**
 * @swagger
 * paths:
 *  /v1/diagnosis/histories:
 *    post:
 *      summary: "진료내역 조회 API"
 *      description: "정보주체의 인증 및 전송요구 확인 후 발급"
 *      tags: [Diagnosis]
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
 *          name: line_no
 *          required: true
 *          description: 줄번호
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
 *                    division_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    division_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    main_division_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    united_division_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    option_division_code:
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
 *                    unit_price_amount:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    unit_dosage_amount:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    day_dosage_amount:
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
router.post('/histories', diagnosis.histories);

/**
 * @swagger
 * paths:
 *  /v1/diagnosis/presciptions:
 *    get:
 *      summary: "처방전교부목록 조회 API"
 *      description: "처방전교부목록 조회 API"
 *      tags: [Diagnosis]
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
 *          description: 처방전교부목록 조회
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
 *                    specification_cnt:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    specification_list:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 */

router.get('/presciptions',diagnosis.presciptions)

/**
 * @swagger
 * paths:
 *  /v1/diagnosis/certifications:
 *    post:
 *      summary: "처방전교부내역 조회 API"
 *      description: "정보주체의 인증 및 전송요구 확인 후 발급"
 *      tags: [Diagnosis]
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
 *          name: pres_certify_no
 *          required: true
 *          description: 처방전교부번호
 *        - in: query
 *          name: search_timestamp
 *          required: false
 *          description: 가장 최근 조회한 시간
 *      responses:
 *        "200":
 *          description: 처방전 교부내역 조회 
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
 *                    patient_discrimination_no:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    patient_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    insurer_type_code:
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
 *                    insured_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    treat_organization_sign:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    prescription_certify_organization_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    prescription_specific_sign_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    direct_prescription_pharmacy_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    treat_start_date:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    prescription_certify_date:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    prescription_dosage_day:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    pharmacy_availability:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    usage_period_day:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 */
router.post('/certifications', diagnosis.certifications);


/**
 * @swagger
 * paths:
 *  /v1/diagnosis/patients:
 *    post:
 *      summary: "수진자상병내역 조회 API"
 *      description: "정보주체의 인증 및 전송요구 확인 후 발급"
 *      tags: [Diagnosis]
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
 *          name: patient_discrimination_no
 *          required: true
 *          description: 처방전교부번호
 *        - in: query
 *          name: search_timestamp
 *          required: false
 *          description: 가장 최근 조회한 시간
 *      responses:
 *        "200":
 *          description: 수진자상병내역 조회
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
 *                    sick_no:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    sick_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    demand_sick_sign:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    demand_diagnosis_department_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    internal_detail_department_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    demand_specific_sign_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    demand_wound_external_type_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    sick_diagnosis_department_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    sick_classification_category_code:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 */
router.post('/patients', diagnosis.patients);


/**
 * @swagger
 * paths:
 *  /v1/diagnosis/apis:
 *    get:
 *      summary: "API 목록 조회"
 *      description: "보제공자가 제공하는 정보제공 API 목록을 회신"
 *      tags: [Diagnosis]
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

router.get("/apis", diagnosis.apis)


/**
 * @swagger
 * paths:
 *  /v1/diagnosis/consents:
 *    get:
 *      summary: "전송요구내역 조회 API"
 *      description: "정정보주체가 특정한 전송요구 내역 조회"
 *      tags: [Diagnosis]
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

router.get("/consents", diagnosis.consents)

module.exports = router