import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { envData } from "@src/config/env";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString = envData.DATABASE_URL;
const pool = new pg.Pool({
  connectionString,
  max: 20, // ເພີ່ມ pool size ເພື່ອຮອງຮັບ transaction ຫຼາຍຂຶ້ນ
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // ໃສ່ adapter ສຳລັບ Prisma 7
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "PROD") {
  globalForPrisma.prisma = prisma;
}

export const connectDatabase = async () => {
  try {
    await prisma.$connect(); // ໃຊ້ $connect() ຂອງ Prisma ໂດຍກົງກໍໄດ້
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ PostgreSQL connected successfully via Prisma 7");
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:");
    console.error(error);
    // ປິດ Pool ເພື່ອບໍ່ໃຫ້ຄ້າງ
    await pool.end();
    process.exit(1);
  }
};
