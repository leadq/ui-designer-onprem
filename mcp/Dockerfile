# syntax=docker/dockerfile:1
ARG NODE_IMAGE
FROM ${NODE_IMAGE} AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=npmrc,target=/tmp/build-npmrc,mode=0444 NPM_CONFIG_USERCONFIG=/tmp/build-npmrc npm ci --no-audit --no-fund
COPY . .
RUN npm run build && npm prune --offline --omit=dev --ignore-scripts

FROM ${NODE_IMAGE}
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/designer ./designer
ENV DESIGNER_BIND_HOST=0.0.0.0 PORT=4854
EXPOSE 4854
CMD ["node","dist/backend/index.js"]
