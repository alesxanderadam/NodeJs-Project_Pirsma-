const express = require("express");
const rootRoute = require("./routes/rootRoute");
const app = express();
app.use(express.json());
app.use(express.static("public"));

app.listen(3001)

app.use("/api", rootRoute)

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const options = {
    definition: {
        info: {
            title: "api",
            version: "1.0.0",
            description: 'API prisma for capstone project by developer name is Quang Huy',
        }
    },
    apis: ["src/swagger/swagger-config.js"]
}
const specs = swaggerJsDoc(options);
app.use("/swagger/capstone-api", swaggerUi.serve, swaggerUi.setup(specs));