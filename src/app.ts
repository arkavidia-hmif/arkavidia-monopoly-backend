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
import * as path from "path";

useRoutingContainer(Container);
useSocketContainer(Container);

export const app = express();
export const server = http.createServer(app);
export const io = new socketio.Server(server);

useExpressServer(app, {
  routePrefix: "/api",
  controllers: [__dirname + "/controllers/api/*.ts"],
  classTransformer: false,
});

useSocketServer(io, {
  controllers: [__dirname + "/controllers/websocket/*.ts"],
});

export const start = async (): Promise<void> => {
  await mainLoader(app);

  app.use("/test", (req, res) => {
    res.sendFile(path.resolve("./src/test.html"));
  });

  const serverPromise = new Promise<void>((resolve) => {
    server.listen(env.port, () => {
      resolve();
    });
  });

  await serverPromise;
  console.info(`⭐ Live on port ${env.port}`);
};
