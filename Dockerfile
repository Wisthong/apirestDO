FROM node:20.12.2 as runner

WORKDIR /app
COPY . .

RUN npm install --force
EXPOSE 3001

CMD [ "npm","run","start" ]

