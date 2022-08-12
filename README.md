# QA AUTOMATION TOOL

Documentation for the system can be found [here](docs/README.md);

#

## Local development

- Install [docker](https://docs.docker.com/get-docker/) and [docker compose](https://docs.docker.com/compose/install/)
- Create environment file

  ```bash
  cp .env.example .env
  ```

- Set environment variables in the `.env` file

- Run

  ```bash
  docker compose up
  ```

##

## Deployment

```bash
/bin/bash deploy.sh
```

## Configurations

### Required envirnoment variables

```
REDIS_HOST
REDIS_PORT
WEBAPI_PORT
WEBAPI_HOST
SELENIUM_GRID_HOST
SELENIUM_GRID_PORT
SELENIUM_MAX_INSTANCES
```

### Selenium max instances

We can provide the environment variable SELENIUM_MAX_INSTANCES in the .env file to configure the number of browser instances.

e.g.
if we set

```
SELENIUM_MAX_INSTANCES=4
```

then four browser instances(i.e. four test cases) can be run simultaneously.

## Readme to linked repository

- [framework-client](./framework-client/README.md)
- [frameworkTestWebsite](./frameworkTestWebsite/README.md)
- [qa-framework](./qa-framework/README.md)
- [webapi](./webapi/README.md)
