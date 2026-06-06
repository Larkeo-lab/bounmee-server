"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = exports.io = void 0;
const socket_io_1 = require("socket.io");
const prisma_1 = require("./prisma");
const initializeSocket = (server) => {
    exports.io = new socket_io_1.Server(server, {
        cors: {
            origin: "*", // allow from anywhere for dev
            methods: ["GET", "POST"],
        },
    });
    exports.io.on("connection", (socket) => {
        console.log("🔌 User connected to Socket.io", socket.id);
        // Emit SETUP event to client upon connection
        socket.emit("SETUP");
        socket.on("JOIN:STORE", (storeId) => {
            socket.join(`store-${storeId}`);
            console.log(`📡 Socket ${socket.id} joined room: store-${storeId}`);
        });
        socket.on("JOIN:USER", (userId) => {
            socket.join(`user-${userId}`);
            console.log(`📡 Socket ${socket.id} joined room: user-${userId}`);
        });
        // Relay table cart updates from POS to Customers AND Save to Database
        socket.on("SYNC_TABLE_CART", async (data, callback) => {
            try {
                // 💾 Update Table's activeCartItems in database (The Source of Truth)
                await prisma_1.prisma.$transaction(async (tx) => {
                    await tx.activeCartItem.deleteMany({
                        where: { tableId: data.tableId },
                    });
                    if (data.cart && data.cart.length > 0) {
                        await tx.activeCartItem.createMany({
                            data: data.cart.map((item) => ({
                                tableId: data.tableId,
                                productId: item.id,
                                name: item.name,
                                price: item.price,
                                image: item.image || null,
                                quantity: item.quantity || 1,
                                stockQty: item.stockQty || 0,
                                status: item.status || "PENDING",
                                note: item.note || null,
                                unitName: item.unitName || null,
                                timestamp: item.timestamp ? BigInt(item.timestamp) : null,
                            })),
                        });
                    }
                    if (data.tableStatus) {
                        await tx.table.update({
                            where: { id: data.tableId },
                            data: {
                                status: data.tableStatus,
                                updatedAt: new Date(),
                            },
                        });
                    }
                }, { timeout: 10000 });
                // 📢 Relay to other connected customers/POS in the same store
                socket.to(`store-${data.storeId}`).emit("TABLE_CART_UPDATED", data);
                // ✅ Acknowledge success back to the sender
                if (callback)
                    callback({ success: true });
            }
            catch (err) {
                console.error("❌ Failed to sync table cart to DB:", err);
                // ❌ Send error back if possible
                if (callback)
                    callback({ success: false, error: err.message });
            }
        });
        socket.on("SEND_CHAT_MESSAGE", async (data, callback) => {
            console.log(`💬 Chat: ${data.sender} from table ${data.tableId} in store ${data.storeId}`);
            let savedMessage = data;
            // 💾 Save to DB
            try {
                savedMessage = await prisma_1.prisma.chatMessage.create({
                    data: {
                        storeId: data.storeId,
                        tableId: data.tableId,
                        text: data.text,
                        sender: data.sender,
                        timestamp: new Date(data.timestamp),
                        isRead: data.isRead || false,
                    },
                });
                data.id = savedMessage.id;
            }
            catch (err) {
                console.error("❌ Failed to save chat message:", err);
            }
            if (callback) {
                callback({ success: true, message: savedMessage });
            }
            // Broadcast to everyone else in the room, so sender doesn't process it twice
            socket.to(`store-${data.storeId}`).emit("CHAT_MESSAGE_RECEIVED", data);
        });
        // Delivery receipt relay
        socket.on("MESSAGE_DELIVERED", (data) => {
            socket.to(`store-${data.storeId}`).emit("MESSAGE_DELIVERED", data);
        });
        // Read receipt relay & DB update
        socket.on("MESSAGE_READ", async (data) => {
            try {
                // Mark specific message or all messages for this table as read
                if (data.messageId) {
                    await prisma_1.prisma.chatMessage.update({
                        where: { id: data.messageId },
                        data: { isRead: true },
                    });
                }
                else if (data.senderToMarkAsRead) {
                    await prisma_1.prisma.chatMessage.updateMany({
                        where: {
                            tableId: data.tableId,
                            sender: data.senderToMarkAsRead,
                            isRead: false,
                        },
                        data: { isRead: true },
                    });
                }
            }
            catch (err) {
                console.log("Failed to mark read:", err);
            }
            socket.to(`store-${data.storeId}`).emit("MESSAGE_READ", data);
        });
        socket.on("TYPING", (data) => {
            // Relay to everyone else in the store
            socket.to(`store-${data.storeId}`).emit("USER_TYPING", data);
        });
        socket.on("disconnect", () => {
            console.log("🔌 User disconnected", socket.id);
        });
    });
    return exports.io;
};
exports.initializeSocket = initializeSocket;
