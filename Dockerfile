# BASE DEPENDENCIES STAGE
FROM node:20-alpine3.16  as base_dependencies
WORKDIR /app

COPY prisma ./
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


# BUILD STAGE
FROM node:20-alpine3.16  as builder
WORKDIR /app

COPY --from=base_dependencies /app/node_modules ./node_modules
COPY --from=base_dependencies /app/package.json ./package.json
COPY . .
RUN yarn build


# PRODUCT DEPENDENCIES STAGE
FROM node:20-alpine3.16  as prod_dependencies
WORKDIR /app

COPY prisma ./
COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile


# PRODUCTION STAGE
FROM node:20-alpine3.16 as prod

WORKDIR /app

COPY .env ./.env

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

COPY --from=builder  /app/node_modules/tsx ./node_modules/tsx
COPY --from=builder  /app/node_modules/@esbuild ./node_modules/@esbuild
COPY --from=builder  /app/node_modules/esbuild ./node_modules/esbuild
COPY --from=builder  /app/node_modules/source-map-support ./node_modules/source-map-support
COPY --from=builder  /app/node_modules/source-map ./node_modules/source-map
COPY --from=builder  /app/node_modules/get-tsconfig ./node_modules/get-tsconfig

COPY --from=prod_dependencies /root/.cache /root/.cache
COPY --from=prod_dependencies /app/node_modules ./node_modules
COPY --from=prod_dependencies /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/templates ./src/templates


CMD ["yarn", "start:prod"]
