const e = require("express");

/**
   * @path {GET} http://localhost:3000/v1/oauth/2.0/authorize
   * @description 요청 데이터 값이 없고 반환 값이 있는 GET Method
   */
exports.authorization = (req, res) => {
    res.set('x-api-tran-id', req.headers['x-api-tran-id'])
    res.json({ ok: true, code: "asdasdasdasdasd",state: req.query.state, api_tran_id: req.headers['x-api-tran-id']})
}
