FROM mhart/alpine-node:14

WORKDIR /app

COPY . /app

EXPOSE 3000

RUN "yarn"

CMD ["yarn", "start"]
