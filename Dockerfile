# Production build. For local development, docker-compose mounts the source
# into a plain node image and runs `npm run dev` instead.
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app
COPY --from=build /app/.output ./.output

EXPOSE 3000
ENV HOST=0.0.0.0 PORT=3000

CMD ["node", ".output/server/index.mjs"]
