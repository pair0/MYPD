const router = require("express").Router()
const individual = require("./individual")

/**
 * @swagger
 * paths:
 *  /v1/oauth/2.0/token:
 *    post:
 *      summary: "접근토큰 발급 요청 AND 접근토큰 갱신"
 *      description: "(Authorization code)를 이용하여 접근토큰을 발급 AND 접근토큰 발급 시 수신한 리프레시 토큰을 통해 새로운 접근토큰 발급"
 *      tags: [MydataAuthorization]
 *      produces:
 *      - application/x-www-form-urlencoded
 *      parameters:
 *        - in: header
 *          name: x-api-tran-id
 *          required: true
 *          description: 거래고유번호
 *      requestBody:
 *        required: true
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:
 *               org_code:
 *                type: string
 *                description : 기관코드
 *               grant_type:
 *                type : string
 *                description :  authorization_code
 *               code:
 *                type : string
 *                description :  인가코드
 *               client_id:
 *                type : string
 *                description :  클라이언트 식별값
 *               client_secret:
 *                type : string
 *                description :  클라이언트 Secret값
 *               redirect_uri:
 *                type : string
 *                description :  인가코드 발급요청 시 요청했던 Callback URL
 *      responses:
 *        "200":
 *          description: 접근토큰 발급
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    token_type:
 *                      type: string
 *                      example:
 *                          "Bearer"
 *                    access_token:
 *                      type: string
 *                      example:
 *                          "0123456789abcdef0123456789abcdef01234567"
 *                    expires_in:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    refresh_token:
 *                      type: string
 *                      example:
 *                          "0123456789abcdef0123456789abcdef01234567"
 *                    refresh_token_expires_in:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 *                    scope:
 *                      type: number
 *                      example:
 *                          "1234567890123456789012345"
 */

router.post("/",individual.token)


/**
  * @swagger
  * paths:
  *  /v1/oauth/2.0/token:
  *    post:
  *      summary: "접근토큰 발급 요청 AND 접근토큰 갱신"
  *      description: "(Authorization code)를 이용하여 접근토큰을 발급 AND 접근토큰 발급 시 수신한 리프레시 토큰을 통해 새로운 접근토큰 발급"
  *      tags: [MydataAuthorization]
  *      produces:
  *      - application/x-www-form-urlencoded
  *      parameters:
  *        - in: header
  *          name: x-api-tran-id
  *          required: true
  *          description: 거래고유번호
  *      requestBody:
  *        required: true
  *        content:
  *          application/x-www-form-urlencoded:
  *            schema:
  *              type: object
  *              properties:
  *               org_code:
  *                type: string
  *                description : 기관코드
  *               grant_type:
  *                type : string
  *                description :  authorization_code
  *               refresh_token:
  *                type : string
  *                description :  접근토큰 갱신을 위한 토큰
  *               client_id:
  *                type : string
  *                description :  클라이언트 식별값
  *               client_secret:
  *                type : string
  *                description :  클라이언트 Secret값
  *      responses:
  *        "200":
  *          description: 접근토큰 갱신
  *          content:
  *            application/json:
  *              schema:
  *                type: object
  *                properties:
  *                    token_type:
  *                      type: string
  *                      example:
  *                          "Bearer"
  *                    access_token:
  *                      type: string
  *                      example:
  *                          "0123456789abcdef0123456789abcdef01234567"
  *                    expires_in:
  *                      type: number
  *                      example:
  *                          "1234567890123456789012345"
  */

router.post("/",individual.token)

module.exports = router
