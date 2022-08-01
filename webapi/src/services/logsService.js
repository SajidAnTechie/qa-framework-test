const { redisClient } = require("../redisDb/redisClient");

function addLogs(key, logs) {
  return redisClient.lPush(key, logs);
}

function clearLogs(key) {
  return redisClient.del(key);
}

function getLogs(key, start, end) {
  return redisClient.lRange(key, start, end);
}

module.exports = { addLogs, clearLogs, getLogs };
