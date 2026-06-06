# Stage 1: Runtime
FROM node:20-bookworm
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# 1. [สำคัญ] Copy แค่ไฟล์ที่จำเป็นสำหรับการลง Library มาก่อน
COPY package.json pnpm-lock.yaml ./
# 2. [สำคัญ] Copy folder prisma มาด้วย (เพราะ pnpm install มักจะเรียก prisma generate อัตโนมัติ)
COPY prisma ./prisma

# 3. รัน install ตรงนี้
# ถ้า package.json หรือ pnpm-lock ไม่เปลี่ยน Docker จะใช้ Cache บรรทัดนี้ทันที (ข้าม 400 กว่าวินาทีไปเลย!)
RUN pnpm install --frozen-lockfile

# 4. Copy ไฟล์ dist ที่คุณคอมไพล์แล้วมาจากข้างนอก
COPY dist ./dist

# 5. สั่ง generate อีกครั้งเพื่อความชัวร์ (ขั้นตอนนี้จะเร็วขึ้นเพราะมี node_modules แล้ว)
RUN pnpm prisma generate --schema=./prisma/schema

ENV PORT=8080
EXPOSE 8080

CMD ["pnpm", "run", "start"]