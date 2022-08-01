const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const router = require("./src/routes/routes");
const { logReqRes } = require("./src/middlewares/logger");
const { errorHandler } = require("./src/middlewares/errorHandler");

const config = {
  name: "webapi",
  port: process.env.WEBAPI_PORT || 3005,
  host: "0.0.0.0",
};

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(logReqRes);

//Routes
app.use("/api/v1", router);
// error handler should be last middleware call.
app.use(errorHandler);

app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error("Internal Server Error.");
  }
  console.log(`${config.name} running on ${config.host}:${config.port}`);
});
