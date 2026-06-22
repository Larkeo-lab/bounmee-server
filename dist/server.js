"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const prisma_1 = require("./config/prisma");
const port = env_1.envData.PORT;
const server = http_1.default.createServer(app_1.default);
server.listen(port, async () => {
    console.log(`🚀 [${process.env.npm_package_name || "Service"}] listening on port ${port}`);
    await (0, prisma_1.connectDatabase)();
});
