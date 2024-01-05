# BASE DEPENDENCIES STAGE
FROM node:18  as base_dependencies
WORKDIR /app

COPY package.json yarn.lock* ./
COPY ./prisma ./prisma
RUN yarn install




# BUILD STAGE
FROM node:18  as builder
WORKDIR /app

COPY --from=base_dependencies /app/node_modules ./node_modules
COPY --from=base_dependencies /app/package.json ./package.json
COPY . .
RUN yarn build


# PRODUCT DEPENDENCIES STAGE
FROM node:18  as prod_dependencies
WORKDIR /app

COPY --from=base_dependencies /app/yarn.lock* ./
COPY --from=base_dependencies /app/node_modules ./node_modules
COPY --from=base_dependencies /app/package.json ./package.json

# RUN yarn remove @nestjs/cli @types/node
RUN yarn install --frozen-lockfile


# PRODUCTION STAGE
FROM node:18

WORKDIR /app

COPY .env ./.env

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

COPY --from=prod_dependencies /root/.cache /root/.cache
COPY --from=prod_dependencies /app/node_modules ./node_modules
COPY --from=prod_dependencies /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/templates ./src/templates


CMD ["yarn", "start:prod"]
