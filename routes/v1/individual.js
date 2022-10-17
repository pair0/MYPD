const mdbConn = require('../../db_connection/mariaDBConn');

/**
   * @path {POST} http://localhost:3000/v1/users
   * @description 접근토큰 및 리프레시토큰 폐기
   */
exports.users = (req, res) => {
    var sql = 'UPDATE service_test SET access_token = ?, refresh_token = ? WHERE authorization_code = ? AND service_client_id = ? AND service_client_secret = ?';
    var params = [null, null, req.query.token, req.query.client_id, req.query.client_secret];
    mdbConn.dbSelect(sql, params)
    .then(() => {
        res.set('x-api-tran-id', req.headers['x-api-tran-id'])
        res.status(200).json({"rsp_code" : "00000" , rsp_msg :"삭제 완료"})
    })
    .catch((err) => {
        res.status(404).json({"rsp_code" : "99999" , rsp_msg :"유효하지 않은 토큰입니다."})
    })
}