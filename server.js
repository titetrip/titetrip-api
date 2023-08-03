import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import http from "http";
import dotenv from "dotenv";
import authenticateToken from "./helpers/authenticateToken.js";
import preAuthRouter from "./helpers/preAuthRouter.js";
import postAuthRouter from "./helpers/postAuthRouter.js";
import initSocket from "./helpers/initSocket.js";
dotenv.config();

export const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
const TESTING_MODE = true;

app.use(express.json());
app.use(
  cors({
    credentials: true,
    methods: "*",
  })
);

// pre auth router (login/signup)
preAuthRouter(app);

if (!TESTING_MODE) app.use(authenticateToken);

// post auth router
postAuthRouter(app);

// init socket
initSocket(server);

// listen on port
server.listen(PORT);
