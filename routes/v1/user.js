const router = require("express").Router()
const individual = require("./individual")

/**
 * @swagger
 * paths:
 *  /v1/users:
 *    post:
 *      summary: "접근토큰 폐기"
 *      description: "개별인증 또는 통합인증을 통해 발급된 접근토큰 및 리프레시 토큰을 유효기간 만료 전 폐기"
 *      tags: [MydataAuthorization]
 *      parameters:
 *        - in: header
 *          name: x-api-tran-id
 *          required: true
 *          description: 거래고유번호
 *        - in: query
 *          name: token
 *          required: true
 *          default: authorization_code
 *        - in: query
 *          name: client_id
 *          required: true
 *          description: 클라이언트 식별값
 *        - in: query
 *          name: client_secret
 *          required: true
 *          description: 클라이언트 Secret값
 *      responses:
 *        "200":
 *          description: 인가코드 폐기
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    rsp_code:
 *                      type: string
 *                      example:
 *                          "00000"
 *                    rsp_msg:
 *                      type: string
 *                      example:
 *                          "삭제 완료"
 *        "404":
 *          description: 인가코드가 유효하지 않음
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                   rsp_code:
 *                      type: string
 *                      example:
 *                          "99999"
 *                   rsp_msg:
 *                      type: string
 *                      example:
 *                          "유효하지 않은 토큰입니다."
 */
router.post('/users', individual.users)
module.exports = router;