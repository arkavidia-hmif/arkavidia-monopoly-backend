FROM mhart/alpine-node:latest

WORKDIR /app

COPY . /app

EXPOSE 3000

RUN "yarn"

CMD ["yarn", "start"]
