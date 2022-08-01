const fs = require("fs");

const getActualRequestDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9; //  convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

// https://codesource.io/creating-a-logging-middleware-in-expressjs/
const expressLogger = (req, res, next) => {
  //middleware function
  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  let method = req.method;
  let url = req.url;
  let status = res.statusCode;
  const start = process.hrtime();
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
  let log = `[${formatted_date}] ${method}:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms`;
  const { body, query, params } = req;
  console.log(log);
  console.log("body=>", JSON.stringify(body, undefined, 2));
  console.log("query=>", JSON.stringify(query, undefined, 2));
  // todo investigate why params is empty for patch requests
  console.log("params=>", JSON.stringify(params, undefined, 2));

  fs.appendFile("request_logs.txt", log + "\n", (err) => {
    if (err) {
      console.log(err);
    }
  });
  next();
};

function logReqRes(req, res, next) {
  const oldWrite = res.write;
  const oldEnd = res.end;

  const chunks = [];

  res.write = (...restArgs) => {
    chunks.push(Buffer.from(restArgs[0]));
    oldWrite.apply(res, restArgs);
  };

  res.end = (...restArgs) => {
    if (restArgs[0]) {
      chunks.push(Buffer.from(restArgs[0]));
    }
    const body = Buffer.concat(chunks).toString("utf8");

    console.log({
      time: new Date().toUTCString(),
      fromIP: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      method: req.method,
      originalUri: req.originalUrl,
      uri: req.url,
      referer: req.headers.referer || "",
      ua: req.headers["user-agent"],
    });
    console.log("Request:", req.body);
    console.log("Response:", body);
    oldEnd.apply(res, restArgs);
  };

  next();
}

module.exports = { logReqRes };
