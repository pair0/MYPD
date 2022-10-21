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
 *          description: 진료내역 목록 조회
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    rsp_code:
 *                      type: number
 *                      example:
 *                          "세부응답코드"
 *                    rsp_msg:
 *                      type: string
 *                      example:
 *                          "세부 응답 메시지"
 *                    search_timestamp:
 *                      type: number
 *                      example:
 *                          "조회 타임스탬프"
 *                    diagnosis_cnt:
 *                      type: number
 *                      example:
 *                          "진료내역 수"
 *                    diagnosis_list:
 *                      type: number
 *                      example:
 *                          "{진료내역 목록(진료식별자세트{--spec_id, --line_no} --is_consent)}"
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
 *          name: line_no
 *          required: true
 *          description: 줄번호
 *        - in: query
 *          name: search_timestamp
 *          required: false
 *          allowEmptyValue: true
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
 *                    division_type_code:
 *                      type: number
 *                      example:
 *                          "분류유형코드 : 1: 수가, 3: 약가, 4: 수입, 원료, 조제, 제제, 7: 협약, 8: 일반재료"
 *                    division_code:
 *                      type: number
 *                      example:
 *                          "분류코드(수가(행위)코드, 약품코드, 재료대코드)"
 *                    main_division_code:
 *                      type: number
 *                      example:
 *                          "주분류코드(구분코드(DIV_CD)에서 산정코드를 제외한 수가 기본코드)"
 *                    united_division_code:
 *                      type: number
 *                      example:
 *                          "통합분류코드 : 1: 수가(상대가치점수표 등록코드), 2: 준용수가, 3: 보험등재약(약제급여목록상한금액표 등록코드), 4: 원료약, 요양기관 자체 조제(제제)약, 5: 보험등재약 일반성분명, 7: 협약재료, 8: 치료재료 한방 A: 수가, B: 준용, C: 약가, G: 협약재료, H: 치료재료, P: 공상option_division_code -I : 기본진료료, 약제, 치료재료, 위탁검사 및 혈액료 등 상대가치점수표상의 요양기관 종별가산율이 적용되지 아니한 항목 II : 요양기관 종별가산율이 적용되는 진료행위 항목medicine_standard_code"
 *                    option_division_code:
 *                      type: number
 *                      example:
 *                          "1란2란구분코드"
 *                    medicine_standard_code:
 *                      type: number
 *                      example:
 *                          "의약품표준코드(13자리) : 국가식별코드(3) + 업체식별코드(4) + 품종코드(함량포함한 품목코드 + 포장단뒤)(5) + 검증번호(1)"
 *                    general_name_code:
 *                      type: number
 *                      example:
 *                          "일반명코드(9자리)) : 주성분 일련번호(4) + 함량 일련번호(2) + 투여경로(1) + 제형(2)"
 *                    whoatc_code:
 *                      type: number
 *                      example:
 *                          "WHOATC코드(7자리 or 5자리) : 해부학적 그룹(1) + 치료적 그룹(2) + 치료적 하위그룹(4) + 화학적/치료적/약물학적 하위그룹(1) + 화학물질(2)"
 *                    unit_price_amount:
 *                      type: number
 *                      example:
 *                          "단가(20자리 정수)"
 *                    unit_dosage_amount:
 *                      type: number
 *                      example:
 *                          "1회투약량"
 *                    day_dosage_amount:
 *                      type: number
 *                      example:
 *                          "1일투여량실시횟수"
 *                    total_dosage_day:
 *                      type: number
 *                      example:
 *                          "총투여일수실시횟수(5자리 정수)"
 *                    price_amount:
 *                      type: number
 *                      example:
 *                          "금액(20자리 정수)"
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
 *          required: false
 *          allowEmptyValue: true
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
 *                          "세부 응답코드"
 *                    rsp_msg:
 *                      type: string
 *                      example:
 *                          "세부 응답메시지"
 *                    search_timestamp:
 *                      type: number
 *                      example:
 *                          "조회 타임스탬프"
 *                    specification_cnt:
 *                      type: number
 *                      example:
 *                          "처방전교부내역 수"
 *                    specification_list:
 *                      type: number
 *                      example:
 *                          "{처방전교부내역 목록(처방전식별자세트{--spec_id, --pres_certify_no}, --is_consent)}"
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
 *          name: pres_certify_no
 *          required: true
 *          description: 처방전교부번호
 *        - in: query
 *          name: search_timestamp
 *          required: false
 *          allowEmptyValue: true
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
 *                          "세부 응답코드"
 *                    rsp_msg:
 *                      type: string
 *                      example:
 *                          "세부 응답메시지"
 *                    search_timestamp:
 *                      type: number
 *                      example:
 *                          "조회 타임스탬프"
 *                    patient_discrimination_no:
 *                      type: number
 *                      example:
 *                          "수진자개인식별번호"
 *                    patient_type_code:
 *                      type: number
 *                      example:
 *                          "수진자구분코드"
 *                    insurer_type_code:
 *                      type: number
 *                      example:
 *                          "보험자구분코드"
 *                    patient_age:
 *                      type: number
 *                      example:
 *                          "수진자연령"
 *                    sex_type_code:
 *                      type: number
 *                      example:
 *                          "성별구분코드"
 *                    insured_type_code:
 *                      type: number
 *                      example:
 *                          "피보험자피부양자구분코드"
 *                    treat_organization_sign:
 *                      type: number
 *                      example:
 *                          "요양기관기호"
 *                    prescription_certify_organization_code:
 *                      type: number
 *                      example:
 *                          "처방전교부기관코드"
 *                    prescription_specific_sign_type_code:
 *                      type: number
 *                      example:
 *                          "처방전특정기호구분코드"
 *                    direct_prescription_pharmacy_type_code:
 *                      type: number
 *                      example:
 *                          "접수직접처방조제구분코드"
 *                    treat_start_date:
 *                      type: number
 *                      example:
 *                          "요양개시일자"
 *                    prescription_certify_date:
 *                      type: number
 *                      example:
 *                          "처방전교부일자"
 *                    prescription_dosage_day:
 *                      type: number
 *                      example:
 *                          "처방투약일수"
 *                    pharmacy_availability:
 *                      type: number
 *                      example:
 *                          "반복조제가능횟수"
 *                    usage_period_day:
 *                      type: number
 *                      example:
 *                          "사용기간일수"
 */
router.post('/certifications', diagnosis.certifications)

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

router.get("/consents", diagnosis.consents)

module.exports = router
