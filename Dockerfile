FROM node:16 As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci
COPY . .

USER node

FROM node:16 As build

WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .

RUN npx prisma generate

RUN npm run build
ENV NODE_ENV production
RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:16-slim As production

RUN apt-get update
RUN apt-get -y install build-essential curl

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

COPY prisma ./prisma/
COPY docker-bootstrap.sh ./

CMD ["/bin/sh", "docker-bootstrap.sh"]