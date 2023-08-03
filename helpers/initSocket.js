import { Server } from "socket.io";

export default function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: "*",
    },
  });
  io.on("connection", (socket) => {});
}
