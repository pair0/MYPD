const {generateuuidv4} = require("../../../../passport/abouttoken");

/**
   * @path {GET} http://localhost:3000/v1/oauth/2.0/authorize
   * @description 인가코드 발급 요청
   */
exports.authorization = (req, res) => {
    //org_code, client_id
    res.set('x-api-tran-id', req.headers['x-api-tran-id'])
    res.json({ 
        ok: true, 
        code: generateuuidv4(),
        state: req.query.state,
        api_tran_id: req.headers['x-api-tran-id']
    })
}
/**
   * @path {POST} http://localhost:3000/v1/oauth/2.0/token
   * @description (Authorization code)를 이용하여 접근토큰을 발급
   */
exports.token = (req, res) => {
    // 접근 토큰 발급 및 접근 토큰 갱신 코드 추가
}