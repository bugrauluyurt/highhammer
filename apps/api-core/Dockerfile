FROM node:18.13.0-bullseye-slim
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

ENV NODE_ENV production

WORKDIR "/app"
COPY --chown=node:node ./dist/ .
EXPOSE 3333

USER node

CMD ["dumb-init", "node", "main.js"]
