FROM node:18-alpine

COPY . /app

WORKDIR /app
RUN npm install
RUN npm run build

CMD npm start

EXPOSE 3030
