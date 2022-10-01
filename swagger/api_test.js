const swaggerUi_api = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "MYPD API TEST",
            description: "TEST for APT",
        },
        servers: [
            {
                url: "http://localhost:3000", // 요청 URL
            },
        ],
    },
  apis: ["./routes/*.js", "./routes/v1/*.js", "./routes/v1/oauth/*.js", "./routes/v1/oauth/2.0/*.js"], //Swagger 파일 연동
}
const specs_api = swaggereJsdoc(options)

module.exports = { swaggerUi_api, specs_api}