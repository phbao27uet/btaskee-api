# Exit on Error
set -eu

# get input
EXECUTE_ENV=$1


# Docker auth
docker login -u gitlab-ci-token -p $CI_JOB_TOKEN $CI_REGISTRY


# Pull latest image
docker pull $CI_REGISTRY_IMAGE:latest

# Stop old container and start new one
# docker stop $APP_NAME || true
# sleep 5
# docker run --rm --name $APP_NAME -d -p $PORT:$PORT $CI_REGISTRY_IMAGE:latest

docker run --rm --name "${APP_NAME}_prisma" $CI_REGISTRY_IMAGE yarn prisma migrate deploy
docker run --rm --name "${APP_NAME}_prisma" $CI_REGISTRY_IMAGE yarn prisma db seed

# check if EXECUTE_ENV is development or production
if [ "$EXECUTE_ENV" = "development" ]; then
    docker compose -f ~/zen-system-api/docker-compose.dev.yml down || true
    docker compose -f ~/zen-system-api/docker-compose.dev.yml up -d    
else
    docker compose -f ~/zen-system-api/docker-compose.yml down || true
    docker compose -f ~/zen-system-api/docker-compose.yml up -d   
fi


# Remove old images
docker image prune -f