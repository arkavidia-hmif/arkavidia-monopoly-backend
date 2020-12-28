import "reflect-metadata";
import express from "express";
import * as http from 'http';
import { useContainer as useRoutingContainer, useExpressServer } from "routing-controllers";
import { useContainer as useSocketContainer, useSocketServer } from 'socket-controllers';
import { mainLoader } from "@/loaders";
import { Container } from "typedi";
import { env } from "./env";
import * as socketio from 'socket.io';

useRoutingContainer(Container);
useSocketContainer(Container);

const app = express();
const server = http.createServer(app)
const io = new socketio.Server(server);

useExpressServer(app, {
  controllers: [__dirname + "/controllers/api/*.ts"],
})
useSocketServer(io, {
  controllers: [__dirname + "/controllers/websocket/*.ts"],
})

mainLoader(app)
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Live on ${env.port}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
