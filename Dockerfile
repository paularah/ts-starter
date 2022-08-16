FROM node:14-alpine AS base

WORKDIR "/app"

COPY . .

RUN npm ci

RUN npm run build

RUN npm prune --production

FROM node:14-alpine AS production

WORKDIR "/app"

COPY --from=base /app/package.json ./package.json

COPY --from=base /app/package-lock.json ./package-lock.json

COPY --from=base /app/dist ./dist

COPY --from=base /app/node_modules ./node_modules

CMD [ "sh", "-c", "npm run start:prod"]