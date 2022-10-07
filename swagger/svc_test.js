const swaggerUi_svc = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            version: "3.23.0",
            title: "MYPD API TEST",
            description: "TEST for APT",
        },
        servers: [
            {
                url: "http://localhost:3000", // 요청 URL
            },
        ],
    },
  apis: ["./routes/*.js", "./routes/v1/*.js", "./routes/v1/oauth/*.js", "./routes/v1/oauth/2.0/*.js","./routes/v1/specification/*.js","./routes/v1/diagnosis/*.js", "./routes/v1/pharmacy/*.js"], //Swagger 파일 연동
}
const specs_svc = swaggereJsdoc(options)

module.exports = { swaggerUi_svc, specs_svc}