"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = exports.prisma = void 0;
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const env_1 = require("../config/env");
const pg_1 = __importDefault(require("pg"));
const globalForPrisma = globalThis;
const connectionString = env_1.envData.DATABASE_URL;
const pool = new pg_1.default.Pool({
    connectionString,
    max: 20, // ເພີ່ມ pool size ເພື່ອຮອງຮັບ transaction ຫຼາຍຂຶ້ນ
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
exports.prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        adapter, // ໃສ່ adapter ສຳລັບ Prisma 7
        log: ["error", "warn"],
    });
if (process.env.NODE_ENV !== "PROD") {
    globalForPrisma.prisma = exports.prisma;
}
const connectDatabase = async () => {
    try {
        await exports.prisma.$connect(); // ໃຊ້ $connect() ຂອງ Prisma ໂດຍກົງກໍໄດ້
        await exports.prisma.$queryRaw `SELECT 1`;
        console.log("✅ PostgreSQL connected successfully via Prisma 7");
    }
    catch (error) {
        console.error("❌ PostgreSQL connection failed:");
        console.error(error);
        // ປິດ Pool ເພື່ອບໍ່ໃຫ້ຄ້າງ
        await pool.end();
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
