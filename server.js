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
const require = createRequire(import.meta.url);
dotenv.config();

export const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
const TESTING_MODE = true;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: "*",
    // witCredentials: true,
  },
});

app.use(express.json());
app.use(cors());

// pre auth router (login/signup)
preAuthRouter(app);

if (!TESTING_MODE) app.use(authenticateToken);

// post auth router
postAuthRouter(app);

// init socket
initSocket(io);

// listen on port
server.listen(PORT);
