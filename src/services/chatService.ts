import { Server } from "socket.io";
export function setupChat(io: Server) {
  io.on("connection", (socket) => {
    socket.on("joinRoom", (roomId) => socket.join(roomId));
    socket.on("message", ({ roomId, message }) => {
      io.to(roomId).emit("message", message);
    });
  });
}