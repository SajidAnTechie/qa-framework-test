# Webapi
Express application providing Rest api to be used for qa-framework.

## Setup
```
npm install
npm run start
```

## Database
We are using **Redis** as our database.
Every api call should provide a **sheetId** and **pageId**. Combination of this is used as key for our redis database.

We are using only two redis datatypes:
- **Hash** -> To store the test statistics and original test request in key **{sheetId}-{pageId}--test-execution**
- **List** -> To store the test execution result in key **{sheetId}-{pageId}-test-result**

We had to use two different keys because redis doesn't allow combining multiple datatypes in a single key. We also wanted to minimize the number of keys we use for each test case.

## Postman Collection

Download postman collection from [google drive](https://drive.google.com/drive/folders/1huHPOh02g5MLNUyiOIMXqLv6va7n-92g?usp=sharing).