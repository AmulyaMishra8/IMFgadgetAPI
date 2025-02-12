const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();

// Load Swagger YAML file
const swaggerDocument = YAML.load("./swagger.yaml");

// Serve Swagger UI at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("Swagger UI available at http://localhost:3000/api-docs");
});
