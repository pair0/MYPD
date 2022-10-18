const swaggerUi_api_access = require("swagger-ui-express")
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
  apis: ["./routes/index.js", "./routes/v1/index.js",  "./routes/v1/individual.js", "./routes/v1/oauth/index.js", "./routes/v1/oauth/2.0/index.js", "./routes/v1/oauth/2.0/individual.js", "./routes/v1/oauth/oauth_api/index.js", "./routes/v1/oauth/oauth_api/token_api.js"], //Swagger 파일 연동
}
const specs_api_access = swaggereJsdoc(options)

module.exports = { swaggerUi_api_access, specs_api_access}