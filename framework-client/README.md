# Framework Client

Framework Client repository is the client library of our qa-framework repository. It does the following things:
- Listens to test requests using Redis Queue
- Uses qa-framework library to run the tests
- Executes test requests in Selenium Grid using qa-framework
- Update test status, test logs and results using webapi calls. The data from framework is provided via callback functions.

## Setup
```
npm install
npm run start
```

## Depends On repository
- qa-framework
- webapi

## How is it setup

The **qa-framework** library is imported as a file dependency in package.json.

```"qa-framework": "file:../qa-framework"```

**qa-framework** should be on the same folder level as **framework-client**.

You can see what is happening in selenium grid going to url http://localhost:4444/ in local it is disabled in remote deployment.

To watch a ongoing test session use password *secret* in local.

# Logger Implementation
The logger implementation is moderate in complexity. We need to keep the following things in mind:
* Don't call the /logs api too frequently as we might overload our server.
* Queue the logs properly so that they appear in the same order as it is sent by qa-framework.
* Ensure you make only one api call at a time so as to preserve the logs order.
* Ensure that logs from different sheets don't mix up.
* Ensure that the timer implementation accounts for edge cases. For eg. the first log which might be an exception that stops the qa-framework. We have done this by having a timer that runs as long as the program runs.

You can look into **loghandler.js** file for implementation details and additional comments.