FROM node:20-alpine as build
WORKDIR /usr/src/app
COPY package* .
RUN npm install
COPY . .

FROM build as development
RUN npm install -g nodemon
EXPOSE 8080
CMD ["npm","run","start"]

FROM build as production
EXPOSE 8080
CMD ["node","dis/index.js"]
