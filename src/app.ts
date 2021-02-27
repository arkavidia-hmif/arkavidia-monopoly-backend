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

const CORSOrigin = [
  "https://room1.monopoly.arkavidia.id",
  "https://room2.monopoly.arkavidia.id",
  "https://room3.monopoly.arkavidia.id",
  "https://room4.monopoly.arkavidia.id",
  "https://room5.monopoly.arkavidia.id",

  "https://monopoly.arkavidia.id",
  "https://staging.monopoly.arkavidia.id",
  "http://localhost:3000",
];

export const app = express();
const server = http.createServer(app);
export const io = new socketio.Server(server, {
  cors: {
    origin: CORSOrigin,
  },
});

useExpressServer(app, {
  cors: {
    origin: CORSOrigin,
  },
  routePrefix: "/api",
  controllers: [__dirname + "/controllers/api/*.ts"],
  classTransformer: false,
});

useSocketServer(io, {
  controllers: [__dirname + "/controllers/websocket/*.ts"],
});

export const start = async (): Promise<http.Server> => {
  await mainLoader(app);

  const serverPromise = new Promise<http.Server>((resolve) => {
    server.listen(env.port, () => {
      resolve(server);
    });
  });

  await serverPromise;
  console.info(`⭐ Live on port ${env.port}`);
  return serverPromise;
};
