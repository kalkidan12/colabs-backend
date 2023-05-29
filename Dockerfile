FROM node:16

WORKDIR usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 5000

CMD ["yarn","dev"]
