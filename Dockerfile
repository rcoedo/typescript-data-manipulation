FROM node:17.6-alpine as development

WORKDIR /app
COPY yarn.lock ./
COPY package.json ./
# RUN yarn add glob rimraf
RUN yarn install --dev
COPY . .
RUN yarn build

FROM node:17.6-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY yarn.lock ./
COPY package.json ./
RUN yarn install --prod
COPY . .
COPY --from=development /app/dist ./dist

CMD ["node", "dist/main"]
