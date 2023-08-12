import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import http from "http";
import dotenv from "dotenv";
import authenticateToken from "./helpers/authenticateToken.js";
import preAuthRouter from "./helpers/preAuthRouter.js";
import postAuthRouter from "./helpers/postAuthRouter.js";
import initSocket from "./helpers/initSocket.js";
// These lines make "require" available
import { createRequire } from "module";
export const require = createRequire(import.meta.url);
dotenv.config();

export const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
const TESTING_MODE = true;
const APPEND_USER = false;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

app.use(express.json());
app.use(cors());

// pre auth router (login/signup)
preAuthRouter(app);

if (!TESTING_MODE)
  app.use((req, res, next) => authenticateToken(req, res, next, APPEND_USER));

// post auth router
postAuthRouter(app);

// init socket
initSocket(io);

// listen on port
server.listen(PORT, () => {
  console.log("Running");
});
