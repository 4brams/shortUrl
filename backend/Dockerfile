FROM node:lts-alpine

WORKDIR /app
COPY . .
RUN npm install

EXPOSE 3000

RUN npm install -g nodemon

CMD ["nodemon", "index.js"]