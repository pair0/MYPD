const router = require("express").Router()
const individual = require("../2.0/individual")

/**
 * @swagger
 * paths:
 *  /v1/oauth/oauth_api/authorize_api:
 *    get:
 *      description: "정보주체의 인증 및 전송요구 확인 후 발급"
 *      tags: [MydataAuthorization]
 *      parameters:
 *        - in: header
 *          name: x-user-ci
 *          required: true
 *          description: 정보주체 CI
 *        - in: header
 *          name: x-api-tran-id
 *          required: true
 *          description: 거래고유번호
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
 *          description: 클라이언트 식별값
 *        - in: query
 *          name: redirect_uri
 *          required: true
 *          description: 마이데이터 서비스 URI
 *        - in: query
 *          name: state
 *          required: true
 *          description: CSRF 방지 목적의 임의설정 값
 */

router.get("/", individual.authorization_api)

module.exports = router