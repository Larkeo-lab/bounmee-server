import http from "http";
import app from "./app";
import { envData } from "./config/env";
import { connectDatabase } from "./config/prisma";
import { initializeSocket } from "./config/socket.io";

const port = envData.PORT;
const server = http.createServer(app);

// Initialize Socket.io
export const io = initializeSocket(server);

server.listen(port, async () => {
  console.log(
    `🚀 [${process.env.npm_package_name || "Service"}] listening on port ${port}`,
  );
  await connectDatabase();
});
