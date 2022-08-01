#!/bin/bash

# Script to deploy the apps using docker compose

echo "Change directory..."
directory=$1
if [ -z $directory ]
    then
        directory=/opt/qa_automation/qa-automation-tool
fi

pushd $directory

echo "Stopping docker containers..."
docker compose down qa-automation-tool

echo "Starting docker containers..."
docker compose -f docker-compose-prod.yml up --build -d

popd
