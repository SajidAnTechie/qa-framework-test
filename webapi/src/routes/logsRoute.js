const { Router } = require("express");
const logsController = require("../controllers/logsController");
const { logCountValidator } = require("../validators/logsValidator");

const logsRouter = Router();

/**
 * GET /api/v1/logs/sheetId/:sheetId/count/:count
*/
logsRouter.get(
  "/sheetId/:sheetId/count/:count",
  logCountValidator,
  logsController.fetchLogs
);

/**
 * PATCH /api/v1/logs/sheetId/:sheetId
*/
logsRouter.patch('/sheetId/:sheetId', logsController.addLogs);

/**
 * Delete /api/v1/logs/sheetId/:sheetId
*/
logsRouter.delete('/sheetId/:sheetId', logsController.clearLogs);

module.exports = logsRouter;
