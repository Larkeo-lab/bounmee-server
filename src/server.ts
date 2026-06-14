import http from "http";
import app from "./app";
import { envData } from "./config/env";
import { connectDatabase } from "./config/prisma";


const port = envData.PORT;
const server = http.createServer(app);


server.listen(port, async () => {
  console.log(
    `🚀 [${process.env.npm_package_name || "Service"}] listening on port ${port}`,
  );
  await connectDatabase();
});
