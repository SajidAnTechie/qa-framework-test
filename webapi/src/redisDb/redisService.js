const { redisClient } = require("./redisClient");

async function getObject(key) {
  const str = await getString(key);
  return JSON.parse(str);
}

async function getString(key) {
  return redisClient.get(key);
}

async function setObject(key, obj) {
  setString(key, JSON.stringify(obj));
}

async function setString(key, data) {
  redisClient.set(key, data);
}

module.exports = { getObject, getString, setString, setObject };
