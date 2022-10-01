const router = require("express").Router()


/**
 * @swagger
 * paths:
 *  /oauth/2.0/authorize:
 *    get:
 *      summary: "인가코드 발급 요청"
 *      description: "정보주체의 인증 및 전송요구 확인 후 발급"
 *      tags: [인증 API]
 *      parameters:
 *        - in: query
 *          name: org_code
 *          required: true
 *          description: 기관코드
 *        - in: query
 *          name: response_type
 *          required: true
 *          description: 인가코드 반환
 *        - in: query
 *          name: client_id
 *          required: true
 *          description: CI값
 *        - in: query
 *          name: redirect_uri
 *          required: true
 *          description: 마이데이터 서비스 URI
 *        - in: query
 *          name: app_scheme
 *          required: true
 *          description: 현재 실행중인 앱 scheme
 *        - in: query
 *          name: state
 *          required: true
 *          description: CSRF 방지 목적의 임의설정 값
 *        - in: header
 *          name: x-user-ci
 *          required: true
 *          description: 정보주체 CI
 *        - in: header
 *          name: x-api-tran-id
 *          required: true
 *          description: 거래고유번호
 * 
 *      responses:
 *        "200":
 *          description: 인가코드 발급
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    code:
 *                      type: string
 *                      example:
 *                          "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
 *                    state:
 *                      type: string
 *                      example:
 *                          "0123456789abcdef0123456789abcdef01234567"
 *                    api_tran_id:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 * 
 *        "404":
 *          description: 인가코드 미발급
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                   rsp_msg:
 *                      type: string
 *                      example:
 *                          "fail"
 */

/**
 * @swagger
 *
 * /api/user/add:
 *  post:
 *    summary: "유저 등록"
 *    description: "POST 방식으로 유저를 등록한다."
 *    tags: [지원 API]
 * 
 *    parameters:
 *        - in: query
 *          name: org_code
 *          required: true
 *          description: 기관코드
 *        - in: query
 *          name: grant_type
 *          required: true
 *          description: 권한부여 방식
 *        - in: query
 *          name: code
 *          required: true
 *          description: 인가코드
 *        - in: query
 *          name: client_id
 *          required: true
 *          description: 클라이언트 ID
 *        - in: query
 *          name: client_secret
 *          required: true
 *          description: 클라이언트 Secret
 *        - in: query
 *          name: redirect URL
 *          required: true
 *          description: Callback URL
 *        - in: header
 *          name: x-user-ci
 *          required: true
 *          description: 정보주체 CI
 *        - in: header
 *          name: x-api-tran-id
 *          required: true
 *          description: 거래고유번호
 * 
 
 *    
 *    requestBody:
 *      description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다. (유저 등록)
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *                description: "유저 고유아이디"
 *              name:
 *                type: string
 *                description: "유저 이름"
 */

router.get("/users");
module.exports = router