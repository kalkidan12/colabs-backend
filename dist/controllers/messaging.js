"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastSeen = exports.getMessages = exports.messagingSocket = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const models_1 = require("../models");
const types_1 = require("../types");
const __1 = require("..");
const connectedUsers = {};
const messagingSocket = (socket) => {
    socket.on('connect-user', async (userId) => {
        if (!connectedUsers[userId])
            connectedUsers[userId] = socket.id;
        await models_1.User.findByIdAndUpdate(userId, { isOnline: true });
    });
    socket.on('disconnect-user', async (disconnectingUserId) => {
        const timeStamp = Date.now();
        const user = await models_1.User.findByIdAndUpdate(disconnectingUserId, { isOnline: false, lastSeen: timeStamp });
        if (user)
            __1.chatIo.sockets.to(connectedUsers[disconnectingUserId]).emit('is_not_online', timeStamp);
        delete connectedUsers[disconnectingUserId];
    });
    socket.on('private-message', async (data) => {
        if (connectedUsers[data.receiverId])
            __1.chatIo.sockets.to(connectedUsers[data.receiverId]).emit('incoming_private_message', data.message);
        if (data.chatId) {
            const chat = await models_1.Chat.findById(data.chatId);
            if (chat) {
                const messageStored = await chat.updateOne({
                    totalMessages: [
                        ...chat.totalMessages,
                        {
                            messageId: data.messageId,
                            sender: data.senderId,
                            message: data.message,
                            timestamp: Date.parse(data.timeStamp),
                        },
                    ],
                    inbox: [...chat.inbox, data.messageId],
                });
                if (!messageStored)
                    __1.chatIo.sockets.to(connectedUsers[data.senderId]).emit('message_store_error', 'Failed to store message');
            }
        }
        else {
            const chatCreated = await models_1.Chat.create({
                type: types_1.ChatType.Private,
                members: [data.senderId, data.receiverId],
                totalMessages: [
                    {
                        messageId: data.messageId,
                        sender: data.senderId,
                        message: data.message,
                        timestamp: Date.parse(data.timeStamp),
                    },
                ],
                inbox: [data.messageId],
            });
            if (!chatCreated)
                __1.chatIo.sockets.to(connectedUsers[data.senderId]).emit('chat_error', 'Failed to create chat');
            else
                __1.chatIo.sockets
                    .to(connectedUsers[data.senderId])
                    .emit('receive_chat_id', { chatId: chatCreated.id, receiverId: data.receiverId });
        }
    });
    socket.on('group-message', async (data) => {
        var _a;
        if (data.groupChatId)
            __1.chatIo.sockets.to(connectedUsers[data.groupChatId]).emit('incoming_group_message', data.message);
        if (data.groupChatId) {
            const chat = await models_1.Chat.findById(data.groupChatId);
            if (chat) {
                const messageStored = await chat.updateOne({
                    totalMessages: [
                        ...chat.totalMessages,
                        {
                            messageId: data.messageId,
                            sender: data.senderId,
                            message: data.message,
                            timestamp: Date.parse(data.timeStamp),
                        },
                    ],
                    inbox: [...chat.inbox, data.messageId],
                });
                if (!messageStored)
                    __1.chatIo.sockets.to(connectedUsers[data.senderId]).emit('message_store_error', 'Failed to store message');
            }
        }
        else {
            const chatCreated = await models_1.Chat.create({
                type: types_1.ChatType.Group,
                members: (_a = data.members) === null || _a === void 0 ? void 0 : _a.split(','),
                totalMessages: [
                    {
                        messageId: data.messageId,
                        sender: data.senderId,
                        message: data.message,
                        timestamp: Date.parse(data.timeStamp),
                    },
                ],
                inbox: [data.messageId],
            });
            if (!chatCreated)
                __1.chatIo.sockets.to(connectedUsers[data.senderId]).emit('group_chat_error', 'Failed to create group chat');
            else
                __1.chatIo.sockets
                    .to(connectedUsers[data.senderId])
                    .emit('receive_group_chat_id', { chatId: chatCreated.id, members: data.members });
        }
    });
    socket.on('mark-read', async (chatId) => {
        const chat = await models_1.Chat.findById(chatId);
        if (chat) {
            await chat.updateOne({
                inbox: [],
            });
        }
    });
};
exports.messagingSocket = messagingSocket;
const getMessages = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const messages = await models_1.Chat.find({ members: { $in: [userId] } });
    if (messages) {
        res.json({
            messages,
            connectedUsers,
        });
    }
    else {
        res.status(404);
        throw new Error('Messages not found');
    }
});
exports.getMessages = getMessages;
const getLastSeen = (0, express_async_handler_1.default)(async (req, res) => {
    const { userIds } = req.body;
    const users = userIds.split(',');
    await new Promise((resolve, _reject) => {
        const lastSeenStatuses = [];
        users.forEach(async (userId, index) => {
            if (userId.length !== 0) {
                const user = await models_1.User.findById(userId);
                const userJson = {
                    userId,
                    userName: `${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName}`,
                    isOnline: user === null || user === void 0 ? void 0 : user.isOnline,
                    lastSeen: user === null || user === void 0 ? void 0 : user.lastSeen,
                };
                lastSeenStatuses.push(userJson);
            }
            if (index === users.length - 2)
                resolve(lastSeenStatuses);
        });
    }).then((lastSeenStatuses) => {
        console.log(lastSeenStatuses);
        res.json(lastSeenStatuses);
    });
});
exports.getLastSeen = getLastSeen;
//# sourceMappingURL=messaging.js.map