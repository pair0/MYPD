const {generateuuidv4} = require("../../../../passport/abouttoken");
const mdbConn = require('../../../../db_connection/mariaDBConn')

/**
   * @path {GET} http://localhost:3000/v1/oauth/2.0/authorize
   * @description 인가코드 발급 요청
   */
exports.authorization = (req, res) => {
    //org_code == 사업자등록번호
    //org_code, client_id
    const info = {
        'org_code' : req.query.org_code,
        'client_id' : req.query.client_id,
        'id' : req.user.e_customer_id
    }
    var sql = 'SELECT * FROM Customers_Enterprise WHERE enterprise_number = ? AND e_customer_id = ?'
    var params = [info['org_code'], info['id']];
    mdbConn.dbSelect(sql, params)
    .then((rows) => {
        info['id_idx'] = rows.id_idx
        var sql = 'SELECT * FROM service_test WHERE service_client_id = ? AND id_idx = ?'
        var params = [info['client_id'], info['id_idx']];
        mdbConn.dbSelect(sql, params)
        .then((rows) => {
            info['authorization_code'] = generateuuidv4(10)
            var sql = "UPDATE service_test SET authorization_code = ?  WHERE service_client_id = ?"
            var params = [info['authorization_code'], info['client_id']];
            mdbConn.dbInsert(sql,params)
            .then(() => {
                res.set('x-api-tran-id', req.headers['x-api-tran-id'])
                res.json({ 
                    ok: true, 
                    code: info['authorization_code'],
                    state: req.query.state,
                    api_tran_id: req.headers['x-api-tran-id']
                })
            })
            .catch(() => {
                console.log("DB Insert Error Check /v1/oauth/2.0/authorize")
            })
        })
        .catch(() => {
            res.status(404).json({rsp_msg : 'client_id is invalid.' })
        })
    })
    .catch(() => {
        res.status(404).json({rsp_msg : 'org_code is invalid.'})
    })
}
/**
   * @path {POST} http://localhost:3000/v1/oauth/2.0/token
   * @description (Authorization code)를 이용하여 접근토큰을 발급
   */
exports.token = (req, res) => {
    // 접근 토큰 발급 및 접근 토큰 갱신 코드 추가
}