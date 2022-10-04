/**
   * @path {GET} http://localhost:3000/v1/diagnosis/lists
   * @description 진료내역 목록 조회 API
   */
exports.lists = (req, res) => {
    // res.set('x-api-tran-id', req.headers['x-api-tran-id'])
    // res.json({ ok: true, code: "asdasdasdasdasd",state: req.query.state, api_tran_id: req.headers['x-api-tran-id']})
}
/**
   * @path {POST} http://localhost:3000/v1/diagnosis/histories
   * @description 진료내역 조회 API
   */
exports.histories = (req, res) => {
   // res.set('x-api-tran-id', req.headers['x-api-tran-id'])
   // res.json({ ok: true, code: "asdasdasdasdasd",state: req.query.state, api_tran_id: req.headers['x-api-tran-id']})
}
/**
   * @path {GET} http://localhost:3000/v1/diagnosis/presciptions
   * @description 처방전교부목록 조회 API
   */
exports.presciptions = (req, res) => {
   // res.set('x-api-tran-id', req.headers['x-api-tran-id'])
   // res.json({ ok: true, code: "asdasdasdasdasd",state: req.query.state, api_tran_id: req.headers['x-api-tran-id']})
}
/**
   * @path {POST} http://localhost:3000/v1/diagnosis/certifications
   * @description 처방전교부내역 조회 API
   */
exports.certifications = (req, res) => {
   // res.set('x-api-tran-id', req.headers['x-api-tran-id'])
   // res.json({ ok: true, code: "asdasdasdasdasd",state: req.query.state, api_tran_id: req.headers['x-api-tran-id']})
}
/**
   * @path {POST} http://localhost:3000/v1/diagnosis/patients
   * @description 수진자상병내역 조회 API
   */
exports.patients = (req, res) => {
   // res.set('x-api-tran-id', req.headers['x-api-tran-id'])
   // res.json({ ok: true, code: "asdasdasdasdasd",state: req.query.state, api_tran_id: req.headers['x-api-tran-id']})
}
/**
   * @path {GET} http://localhost:3000/v1/diagnosis/apis
   * @description API 목록 조회
   */
exports.apis = (req, res) => {
   // res.set('x-api-tran-id', req.headers['x-api-tran-id'])
   // res.json({ ok: true, code: "asdasdasdasdasd",state: req.query.state, api_tran_id: req.headers['x-api-tran-id']})
}
/**
   * @path {GET} http://localhost:3000/v1/diagnosis/consents
   * @description API 목록 조회
   */
exports.consents = (req, res) => {
   // res.set('x-api-tran-id', req.headers['x-api-tran-id'])
   // res.json({ ok: true, code: "asdasdasdasdasd",state: req.query.state, api_tran_id: req.headers['x-api-tran-id']})
}