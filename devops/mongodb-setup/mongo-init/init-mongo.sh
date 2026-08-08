#!/bin/bash
# Runs automatically on first container start (docker-entrypoint-initdb.d).
# Creates an app-level DB user (least privilege, instead of using root)
# and the base collections/indexes CloudVault needs.
set -e

mongosh <<EOF
use $MONGO_INITDB_DATABASE

db.createUser({
  user: '$MONGO_APP_USER',
  pwd: '$MONGO_APP_PASSWORD',
  roles: [
    { role: 'readWrite', db: '$MONGO_INITDB_DATABASE' }
  ]
})

db.createCollection('users')
db.createCollection('files')
db.createCollection('folders')

db.users.createIndex({ email: 1 }, { unique: true })
db.files.createIndex({ owner: 1 })
db.files.createIndex({ folderId: 1 })
db.folders.createIndex({ owner: 1 })

print('CloudVault MongoDB initialization complete.')
EOF
