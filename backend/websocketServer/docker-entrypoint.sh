#!/bin/bash

echo "Migrating the mysqlDB"
npm run migrate:mysql

# echo "Migrating the mongoDB"
# npm run migrate:mongodb

node /server/server.js
