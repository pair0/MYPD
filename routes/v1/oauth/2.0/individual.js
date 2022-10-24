const {generateuuidv4, generateAccessToken, generateRefreshToken, getTokenChk} = require("../../../../passport/abouttoken");
const mdbConn = require('../../../../db_connection/mariaDBConn');
const { json } = require("express");

/**
   * @path {GET} http://localhost:3000/v1/oauth/2.0/authorize
   * @description 인가코드 발급 요청
   */
exports.authorization = (req, res) => {
    //org_code == 사업자등록번호
    //org_code, client_id
    //ci를 검증하라 하지만 ci에 대한 정보 없음.....
    //마이데이터사업자가 전송한 개별인증-001 파라미터들 (x-user-ci, client_id, redirect_uri 등) 검증
    //마이데이터사업자가 전송한 redirect_uri가 해당 마이데이터사업자의 Callback URL 목록*에 속해있는지 여부 검증
    const info = {
        'org_code' : req.query.org_code,
        'client_id' : req.query.client_id,
    }
    const sql = {
        'checkOrg_code' :'SELECT * FROM Customers_Enterprise WHERE enterprise_number = ?',
        'checkClient_id' : 'SELECT * FROM service_test WHERE service_client_id = ? AND id_idx = ?',
        'updateAuthorization_code' : 'UPDATE service_test SET authorization_code = ?  WHERE service_client_id = ?',
    }
    var params = [info['org_code']];
    mdbConn.dbSelect(sql['checkOrg_code'], params)
    .then((rows) => {
        info['id_idx'] = rows.id_idx
        var params = [info['client_id'], info['id_idx']];
        mdbConn.dbSelect(sql['checkClient_id'], params)
        .then((rows) => {
            if(rows == undefined)
                res.status(404).json({rsp_msg : 'client_id is invalid.' })
            info['authorization_code'] = generateuuidv4(10);
            var params_null = [null, info['client_id']];
            // 인가코드 10분 제한 코드 (비동기 동작))
            setTimeout(() => {
                mdbConn.dbSelect(sql['updateAuthorization_code'], params_null);
            }, 600000) 
            // 인가코드 생성 및 DB 저장
            var params = [info['authorization_code'], info['client_id']];
            mdbConn.dbInsert(sql['updateAuthorization_code'],params)            
            .then(() => {
                res.set('x-api-tran-id', req.headers['x-api-tran-id'])  // 이걸 사용자가 입력하는 것이 맞을까...?
                res.status(200).json({ 
                    ok: true, 
                    code: info['authorization_code'],
                    state: req.query.state,
                    api_tran_id: req.headers['x-api-tran-id']
                })
                var code = info['authorization_code']
                return code
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
    // 거래고유번호는 API 요청기관이 넘겨주는 것
    // iss : 접근 토큰 발급자 (접근토큰을 발급하는 기관의 기관코드)  -> API 종류에 따라 다름
    // aud : 접근 토큰 수신자 (접근토큰을 발급받는 기관 식별자) -> API 종류에 따라 다름
    // jti : 접근 토큰 식별자 (발급주체가 토큰을 식별할 수 있는 ID(임의지정))
    // exp : 접근토큰 만료시간 
    // scope : 개인정보 제공 범위 -> 얘는 어떻게 지정해줘??
    const sql = {
        'checkInfo' : 'SELECT * FROM service_test WHERE authorization_code = ? AND service_client_id = ? AND service_client_secret = ?',
        'updateToken' : "UPDATE service_test SET access_token = ? ,refresh_token = ?  WHERE service_client_id = ?",
        'updateAccessToken' : "UPDATE service_test SET access_token = ? WHERE service_client_id = ?",
        'checkRefresh_token' : 'SELECT * FROM service_test WHERE refresh_token = ? AND service_client_id = ?'
    }
    const info = {
        'org_code' : req.body.org_code,
        'client_id' : req.body.client_id,
        'client_secret' : req.body.client_secret,
        'authorization_code' : req.body.code,
    }
    console.log(req.body.refresh_token)
    // refresh_token이 없다면 refreshToken, accessToken 생성
    var params = [info['authorization_code'], info['client_id'], info['client_secret']];
    mdbConn.dbSelect(sql['checkInfo'],params)
    .then((rows) => {
        if (rows == undefined) return res.status(404).json({rsp_msg : '인증 실패.'})
        if(req.body.refresh_token == ""){
            var accessExpiresIn = 7776000;
            var refreshExpiresIn = 31557600;
            const payload = {
                'client_id' : info['client_id']
            };
            const accessToken = 'Bearer ' + generateAccessToken(payload, accessExpiresIn)
            const refreshToken = 'Bearer ' + generateRefreshToken(payload,refreshExpiresIn)
            var params = [accessToken, refreshToken, info['client_id']]
            mdbConn.dbInsert(sql['updateToken'], params)
            .then(() => {
                res.set('x-api-tran-id', req.headers['x-api-tran-id'])
                res.status(200).json({ 
                    token_type: 'Bearer', 
                    access_token: accessToken,
                    expires_in: accessExpiresIn,
                    refresh_token: refreshToken,
                    refresh_token_expires_in: refreshExpiresIn,
                })
            })
            .catch((err) => {
                console.log(err)
                res.status(404).json({rsp_msg : 'token 생성 실패.'})
            })
        }
        else{
            var params = [req.body.refresh_token, info['client_id']];
            mdbConn.dbSelect(sql['checkRefresh_token'], params)
            .then((rows) => {
                var refreshToken = getTokenChk(req.body.refresh_token, "refresh")
                if(refreshToken == "valid" && rows != undefined ){
                    const payload = {
                        'client_id' : info['client_id']
                    }
                    const newAccessToken = 'Bearer ' + generateAccessToken(payload);
                    var params = [newAccessToken,  info['client_id']]
                    mdbConn.dbInsert(sql['updateAccessToken'], params)
                    .then(() => {
                        res.set('x-api-tran-id', req.headers['x-api-tran-id'])
                        res.status(200).json({
                            "token_type" : 'Bearer',
                            "access_token" : newAccessToken,
                            "expires_in" : 7776000
                        })
                    })
                    .catch(() => {
                        res.status(500).json({rsp_msg : 'access token 생성 실패.'})
                    })
                }
                else{
                    var accessExpiresIn = 7776000;
                    var refreshExpiresIn = 31557600;
                    const payload = {
                        'client_id' : info['client_id']
                    };
                    const accessToken = 'Bearer ' + generateAccessToken(payload, accessExpiresIn)
                    const refreshToken = 'Bearer ' + generateRefreshToken(payload,refreshExpiresIn)
                    var params = [accessToken, refreshToken, info['client_id']]
                    mdbConn.dbInsert(sql['updateToken'], params)
                    .then(() => {
                        res.set('x-api-tran-id', req.headers['x-api-tran-id'])
                        res.status(200).json({ 
                            token_type: 'Bearer', 
                            access_token: accessToken,
                            expires_in: accessExpiresIn,
                            refresh_token: refreshToken,
                            refresh_token_expires_in: refreshExpiresIn,
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                        res.status(500).json({rsp_msg : 'refresh token 생성 실패.'})
                    })
                }
            })
            .catch(() => {
                console.log(err)
                console.log(req.body.refresh_token)
                res.status(500).json({rsp_msg : 'refresh token 갱신 실패.'})
            })
        }
    })
    .catch((err) => {
        console.log(err)
        res.status(404).json({rsp_msg : '인증 실패.'})
    })
    
}

/**
   * @path {POST} http://localhost:3000/v1/oauth/oauth_api/authorize_api
   * @description 인가코드 발급 요청
*/
exports.authorization_api = (req, res) => {
    console.log(req.body);
    //org_code == 사업자등록번호
    //org_code, client_id
    //ci를 검증하라 하지만 ci에 대한 정보 없음.....
    //마이데이터사업자가 전송한 개별인증-001 파라미터들 (x-user-ci, client_id, redirect_uri 등) 검증
    //마이데이터사업자가 전송한 redirect_uri가 해당 마이데이터사업자의 Callback URL 목록*에 속해있는지 여부 검증
    const info = {
        'org_code' : req.body.org_code,
        'client_id' : req.body.client_id,
    }
    const sql = {
        'checkOrg_code' :'SELECT * FROM Customers_Enterprise WHERE enterprise_number = ? ',
        'checkClient_id' : 'SELECT * FROM service_test WHERE service_client_id = ? AND id_idx = ?',
        'updateAuthorization_code' : 'UPDATE service_test SET authorization_code = ?  WHERE service_client_id = ?',
    }
    var params = [info['org_code']];
    mdbConn.dbSelect(sql['checkOrg_code'], params)
    .then((rows) => {
        var params = [info['client_id']];
        mdbConn.dbSelect(sql['checkClient_id'], params)
        .then((rows) => {
            if(rows == undefined)
                res.status(404).json({rsp_msg : 'client_id is invalid.' })
            info['authorization_code'] = generateuuidv4(10);
            var params_null = [null, info['client_id']];
            // 인가코드 10분 제한 코드 (비동기 동작))
            setTimeout(() => {
                mdbConn.dbSelect(sql['updateAuthorization_code'], params_null);
            }, 600000) 
            // 인가코드 생성 및 DB 저장
            var params = [info['authorization_code'], info['client_id']];
            mdbConn.dbInsert(sql['updateAuthorization_code'],params)            
            .then(() => {
                res.set('x-api-tran-id', req.headers['x-api-tran-id'])  // 이걸 사용자가 입력하는 것이 맞을까...?
                var code = info['authorization_code'];
                req.session.code = code;
                res.redirect('/testbed/inte_api_access');
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
 exports.token_api = (req, res) => {
    // 거래고유번호는 API 요청기관이 넘겨주는 것
    // iss : 접근 토큰 발급자 (접근토큰을 발급하는 기관의 기관코드)  -> API 종류에 따라 다름
    // aud : 접근 토큰 수신자 (접근토큰을 발급받는 기관 식별자) -> API 종류에 따라 다름
    // jti : 접근 토큰 식별자 (발급주체가 토큰을 식별할 수 있는 ID(임의지정))
    // exp : 접근토큰 만료시간 
    // scope : 개인정보 제공 범위 -> 얘는 어떻게 지정해줘??
    const sql = {
        'checkInfo' : 'SELECT * FROM service_test WHERE authorization_code = ? AND service_client_id = ? AND service_client_secret = ? ',
        'updateToken' : "UPDATE service_test SET access_token = ? ,refresh_token = ?  WHERE service_client_id = ?",
        'updateAccessToken' : "UPDATE service_test SET access_token = ? WHERE service_client_id = ?",
        'checkRefresh_token' : 'SELECT * FROM service_test WHERE refresh_token = ? AND service_client_id = ?'
    }
    const info = {
        'org_code' : req.body.org_code,
        'client_id' : req.body.client_id,
        'client_secret' : req.body.client_secret,
        'authorization_code' : req.body.code,
    }
    // refresh_token이 없다면 refreshToken, accessToken 생성
        var params = [info['authorization_code'], info['client_id'], info['client_secret']];
        mdbConn.dbSelect(sql['checkInfo'],params)
        .then((rows) => {
            if (rows == undefined) return res.status(404).json({rsp_msg : '인증 실패.'})
            if(req.body.refresh_token == ""){
                var accessExpiresIn = 7776000;
                var refreshExpiresIn = 31557600;
                const payload = {
                    'client_id' : info['client_id']
                };
                const accessToken = 'Bearer ' + generateAccessToken(payload, accessExpiresIn)
                const refreshToken = 'Bearer ' + generateRefreshToken(payload,refreshExpiresIn)
                var params = [accessToken, refreshToken, info['client_id']]
                mdbConn.dbInsert(sql['updateToken'], params)
                .then(() => {
                    res.set('x-api-tran-id', req.headers['x-api-tran-id'])
                    // res.status(200).json({ 
                    //     token_type: 'Bearer', 
                    //     access_token: accessToken,
                    //     expires_in: accessExpiresIn,
                    //     refresh_token: refreshToken,
                    //     refresh_token_expires_in: refreshExpiresIn,
                    //     scope: '?'
                    // })
                    var code = {
                        'org_code' : info['org_code'],
                        'callback_url' : req.body.redirect_uri,
                        'client_id' : info['client_id'],
                        'client_secret' : info['client_secret'],
                        'access_token': accessToken
                    };
                    req.session.code_final = code;
                    res.redirect('/testbed/inte_api_final');
                })
                .catch((err) => {
                    console.log(err)
                    res.status(404).json({rsp_msg : 'refresh token 생성 실패.'})
                })
            }
            else{
                var params = [req.body.refresh_token, info['client_id']];
                mdbConn.dbSelect(sql['checkRefresh_token'], params)
                .then((rows) => {
                    var refreshToken = getTokenChk(req.body.refresh_token, "refresh")
                    if(refreshToken == "valid" && rows != undefined ){
                        const payload = {
                            'idx' : info['id_idx']
                        }
                        const newAccessToken = 'Bearer ' + generateAccessToken(payload);
                        var params = [newAccessToken,  info['client_id']]
                        mdbConn.dbInsert(sql['updateAccessToken'], params)
                        .then(() => {
                            res.set('x-api-tran-id', req.headers['x-api-tran-id'])
                            // res.status(200).json({
                            //     "token_type" : 'Bearer',
                            //     "access_token" : newAccessToken,
                            //     "expires_in" : 7776000
                            // })
                            var code = {
                                'org_code' : info['org_code'],
                                'callback_url' : req.body.redirect_uri,
                                'client_id' : info['client_id'],
                                'client_secret' : info['client_secret'],
                                'access_token': newAccessToken
                            };
                        })
                        .catch(() => {
                            res.status(500).json({rsp_msg : 'access token 생성 실패.'})
                        })
                    }
                    else{
                        var accessExpiresIn = 7776000; //90일
                        var refreshExpiresIn = 31557600; // 365일
                        const payload = {
                            'client_id' : info['client_id']
                        };
                        const accessToken = 'Bearer ' + generateAccessToken(payload, accessExpiresIn)
                        const refreshToken = 'Bearer ' + generateRefreshToken(payload,refreshExpiresIn)
                        var params = [accessToken, refreshToken, info['client_id']]
                        mdbConn.dbInsert(sql['updateToken'], params)
                        .then(() => {
                            res.set('x-api-tran-id', req.headers['x-api-tran-id'])
                            // res.status(200).json({ 
                            //     token_type: 'Bearer', 
                            //     access_token: accessToken,
                            //     expires_in: accessExpiresIn,
                            //     refresh_token: refreshToken,
                            //     refresh_token_expires_in: refreshExpiresIn,
                            //     scope: '?'
                            // })
                            var code = {
                                'org_code' : info['org_code'],
                                'callback_url' : req.body.redirect_uri,
                                'client_id' : info['client_id'],
                                'client_secret' : info['client_secret'],
                                'access_token': accessToken
                            };
                        })
                        .catch((err) => {
                            console.log(err)
                            res.status(500).json({rsp_msg : 'refresh token 생성 실패.'})
                        })
                    }
                })
                .catch(() => {
                    console.log(err)
                    console.log(req.body.refresh_token)
                    res.status(500).json({rsp_msg : 'refresh token 갱신 실패.'})
                })
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(404).json({rsp_msg : '인증 실패.'})
        })

}