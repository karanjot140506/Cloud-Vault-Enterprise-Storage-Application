# CloudVault DevOps

## Folder layout
```
mongodb-setup/
  docker-compose.mongo.yml
  mongo-init/init-mongo.sh
minio-setup/
  docker-compose.minio.yml
.github/workflows/ci-cd.yml
.env.example
```

## One-time setup
1. Create the shared network once (both compose files attach to it):
   ```
   docker network create cloudvault-network
   ```
2. Copy `.env.example` to `.env` and fill in real credentials. Place a copy
   of it next to each compose file (or pass `--env-file` explicitly).

## Run
```
docker compose -f mongodb-setup/docker-compose.mongo.yml --env-file .env up -d
docker compose -f minio-setup/docker-compose.minio.yml --env-file .env up -d
```
- MongoDB: `mongodb://<MONGO_APP_USER>:<MONGO_APP_PASSWORD>@localhost:27017/cloudvault`
- MinIO API: `http://localhost:9000`  |  Console: `http://localhost:9001`

## CI/CD
`.github/workflows/ci-cd.yml` runs on every push/PR to `main`/`develop`:
backend build+test (Maven/JDK 17), frontend build+test (npm/Node 20), then
builds Docker images for both. Expects `pom.xml` in `/backend` and
`package.json` in `/frontend` at repo root — adjust paths if your layout differs.

## Assumptions made (tell me if any are wrong)
- Backend: Java/Spring Boot in `/backend`, Maven, Java 17.
- Frontend: React (Create React App style `npm test`/`npm run build`) in `/frontend`.
- Both services are containerized separately (no combined root Dockerfile).
- Mongo app connects with a dedicated non-root user (`MONGO_APP_USER`), not root.
