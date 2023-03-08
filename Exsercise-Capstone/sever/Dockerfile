FROM node:18


WORKDIR /urc/src/app

COPY package*.json .

RUN yarn install --save-dev

COPY . .

EXPOSE 3001

CMD [ "yarn" , "start" ]