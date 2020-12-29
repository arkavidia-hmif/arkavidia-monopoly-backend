import "reflect-metadata";
import express from "express";
import * as http from "http";
import {
  useContainer as useRoutingContainer,
  useExpressServer,
} from "routing-controllers";
import {
  useContainer as useSocketContainer,
  useSocketServer,
} from "socket-controllers";
import { mainLoader } from "@/loaders";
import { Container } from "typedi";
import { env } from "./env";
import * as socketio from "socket.io";

useRoutingContainer(Container);
useSocketContainer(Container);

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

mainLoader(app)
  .then(() => {
    useExpressServer(app, {
      routePrefix: "/api",
      controllers: [__dirname + "/controllers/api/*.ts"],
      classTransformer: false,
    });
    useSocketServer(io, {
      controllers: [__dirname + "/controllers/websocket/*.ts"],
      useClassTransformer: false,
    });

    app.listen(env.port, () => {
      console.log(`Live on ${env.port}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
