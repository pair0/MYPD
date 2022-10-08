const swaggerUi_api = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",

        servers: [
            {
                url: "http://localhost:3000", // 요청 URL
            },
        ],
    },
  apis: ["./routes/v1/oauth/2.0/authorize.js"], //Swagger 파일 연동
}
const specs_api = swaggereJsdoc(options)

module.exports = { swaggerUi_api, specs_api}