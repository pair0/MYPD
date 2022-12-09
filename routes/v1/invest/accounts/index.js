const router = require("express").Router()
const mdbConn = require('../../../../db_connection/mariaDBConn')
const {body} = require('express-validator');
var request = require('request')

router.get('/basic', function(req,res,next){
    var path = req.get('X-FSI-TARGET-SERVER-URI');
    paramiter = req.query;
    var sql = 'SELECT id_idx FROM Customers_Enterprise WHERE enterprise_number = ?';
    var params = req.query.org_code;
    mdbConn.dbSelect(sql, params)
    .then((rows) => {
        if (!rows) res.status(400).json({rsp_msg : "mypd 테스트베드 회원이 아닙니다."})
        else {
            sql = 'SELECT service_id FROM service_test WHERE id_idx = ? AND service_client_id = ?'
            params = [rows.id_idx, req.query.client_id]
            mdbConn.dbSelect(sql, params)
            .then((rows) => {
                if (!rows) res.status(400).json({rsp_msg : "올바르지 않은 client_id 입니다."})
                else {
                    sql = 'SELECT m.* FROM service_approve a, server_management m WHERE m.server_ip = ? AND m.server_manage_id = a.server_manage_id AND a.service_id = ?';
                    params = [path, rows.service_id];
                    mdbConn.dbSelect(sql, params)
                    .then((rows) => {
                        if (!rows) res.status(400).json({rsp_msg : "해당 API 서버와 연동이 되지 않았습니다."})
                        else {
                            const options = {
                                uri: "http://mypd.kr:62514/v1/oauth/2.0/authorize",
                                qs:{
                                    org_code:req.query.org_code,
                                    response_type:req.query.response_type,
                                    client_id:req.query.client_id,
                                    redirect_uri:req.query.redirect_uri,
                                    state:req.query.state
                                }
                              };
                              request(options,function(err,response,body){
                                res.status(200).json(JSON.parse(body))
                                if(err != null){
                                    res.status(404).json({rsp_msg : "잘못된 접근입니다."})
                                }
                              })
                        }
                    }).catch((err) => {
                        res.status(404).json({rsp_msg : "잘못된 접근입니다."})
                    });
                }
            }).catch((err) => {
                res.status(404).json({rsp_msg : "잘못된 접근입니다."})
            });
        }
    }).catch((err) => {
        res.status(404).json({rsp_msg : "잘못된 접근입니다."})
    });
});

module.exports = router;