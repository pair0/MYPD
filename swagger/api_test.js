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
        components: {
            securitySchemes: {
                bearerAuth: {
                    description: "발급된 접근토큰 등록 (Bearer 제외한 접근토큰 입력)",
                    type: "http",
                    name: "Authorization",
                    scheme: "bearer",
                    in: "header",
                    bearerFormat: "JWT",
                }
            }
        },
        security: [{ bearerAuth: [] }],
    },
  apis: ["./routes/index.js", "./routes/v1/index.js",  "./routes/v1/individual.js", "./routes/v1/oauth/index.js", "./routes/v1/oauth/2.0/index.js", "./routes/v1/oauth/2.0/individual.js", "./routes/v1/oauth/oauth_api/index.js", "./routes/v1/oauth/oauth_api/authorize_api.js"], //Swagger 파일 연동
}
const specs_api = swaggereJsdoc(options)

module.exports = { swaggerUi_api, specs_api}