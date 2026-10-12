FROM node:22-alpine

WORKDIR /app
COPY deploy/sqyre-relay/package.json ./package.json
RUN npm install --omit=dev --ignore-scripts --package-lock=false

COPY tools/dicebox-foundry-connector-contract.mjs ./tools/dicebox-foundry-connector-contract.mjs
COPY tools/dicebox-foundry-live-bridge.mjs ./tools/dicebox-foundry-live-bridge.mjs
COPY tools/dicebox-foundry-remote-auth.mjs ./tools/dicebox-foundry-remote-auth.mjs
COPY tools/dicebox-foundry-remote-gateway.mjs ./tools/dicebox-foundry-remote-gateway.mjs
COPY packages/dicebox-foundry/module.json ./packages/dicebox-foundry/module.json
COPY packages/dicebox-foundry/src/module.js ./packages/dicebox-foundry/src/module.js

ENV NODE_ENV=production
EXPOSE 8798
CMD ["node", "tools/dicebox-foundry-remote-gateway.mjs"]
