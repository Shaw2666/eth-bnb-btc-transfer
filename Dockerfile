FROM node:16.13-alpine3.14 as builder
WORKDIR /usr/app
COPY package.json .
COPY . .
RUN npm install
EXPOSE 18332
CMD ["npm", "start"]