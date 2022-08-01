const { Router } = require("express");
const testResult = require("../controllers/testResult");
const { redisClient } = require("../redisDb/redisClient");
const responseCodes = require("../constants/responseCodes");
const { resultValidator } = require("../validators/resultValidator");

const testRouter = require("./testRoute");
const logsRouter = require("./logsRoute");

const router = Router();

router.get("/", (req, res) => {
  const status = responseCodes.ok;
  res.json({
    code: status.code,
    apiVersion: "v1",
    message: "Server is up and running.",
  });
});

router.use("/test", testRouter);

/**
 * POST /api/v1/result
*/
router.post("/result", resultValidator, testResult);

// this api is for development purpose only
router.get("/devClearRedisCache", async (req, res) => {
  try {
    await redisClient.flushDb();
  } catch (err) {
    throw err;
  }

  const status = responseCodes.ok;
  res.json({
    code: status.code,
    message: "Successfully cleared redis cache",
  });
});

router.use("/logs", logsRouter);

module.exports = router;
