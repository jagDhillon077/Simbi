#!/bin/bash

# Use this script to push changes to the prototype on AWS.

# Before running, add the following to your ssh config.
#  Host slc
#  HostName <prototype_IP>
#  User ubuntu
#  IdentityFile <path_to_private_key>

git checkout prototype
git rebase origin/dev

retVal=$?
if [ $retVal -ne 0 ]; then
    exit $retVal
fi

docker build -t andreram/slc:frontend-test .
docker push andreram/slc:frontend-test

ssh slc "
docker-compose pull
docker-compose up -d
docker image prune -f
"
