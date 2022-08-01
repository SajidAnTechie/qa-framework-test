const axios = require('axios');

const WEBAPI_PORT = process.env.WEBAPI_PORT || 5001;
const WEBAPI_HOST = process.env.WEBAPI_HOST || 'localhost';
const BASE_URL = `http://${WEBAPI_HOST}:${WEBAPI_PORT}/api/v1`;

const api = axios.create({
  baseURL: BASE_URL,
});

module.exports = { api };
