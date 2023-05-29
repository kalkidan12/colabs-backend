import { Request, Response } from '../types/express';
import asyncHandler from 'express-async-handler';
import { Socket } from 'socket.io';
import { Chat, User } from '../models';
import { ChatType } from '../types';
import { chatIo } from '..';

const connectedUsers: { [userId: string]: string } = {};

/**
 * Messaging Socket
 * @access Private
 */
const messagingSocket = (socket: Socket<any>) => {
  socket.on('connect-user', async (userId: string) => {
    if (!connectedUsers[userId]) connectedUsers[userId] = socket.id;

    await User.findByIdAndUpdate(userId, { isOnline: true });
  });

  socket.on('disconnect-user', async (disconnectingUserId: string) => {
    const timeStamp = Date.now();
    const user = await User.findByIdAndUpdate(disconnectingUserId, { isOnline: false, lastSeen: timeStamp });

    if (user) chatIo.sockets.to(connectedUsers[disconnectingUserId]).emit('is_not_online', timeStamp);
    delete connectedUsers[disconnectingUserId];
  });

  socket.on(
    'private-message',
    async (data: {
      senderId: string;
      receiverId: string;
      message: string;
      messageId: string;
      timeStamp: string;
      chatId?: string;
    }) => {
      if (connectedUsers[data.receiverId])
        chatIo.sockets.to(connectedUsers[data.receiverId]).emit('incoming_private_message', data.message);

      if (data.chatId) {
        const chat = await Chat.findById(data.chatId);

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
            // TODO: Only if user is not online
            inbox: [...chat.inbox, data.messageId],
          });

          if (!messageStored)
            chatIo.sockets.to(connectedUsers[data.senderId]).emit('message_store_error', 'Failed to store message');
        }
      } else {
        const chatCreated = await Chat.create({
          type: ChatType.Private,
          members: [data.senderId, data.receiverId],
          totalMessages: [
            {
              messageId: data.messageId,
              sender: data.senderId,
              message: data.message,
              timestamp: Date.parse(data.timeStamp),
            },
          ],
          // TODO: Only if user is not online
          inbox: [data.messageId],
        });

        if (!chatCreated) chatIo.sockets.to(connectedUsers[data.senderId]).emit('chat_error', 'Failed to create chat');
        else
          chatIo.sockets
            .to(connectedUsers[data.senderId])
            .emit('receive_chat_id', { chatId: chatCreated.id, receiverId: data.receiverId });
      }
    },
  );

  socket.on(
    'group-message',
    async (data: {
      senderId: string;
      groupChatId?: string;
      members?: string;
      message: string;
      messageId: string;
      timeStamp: string;
    }) => {
      if (data.groupChatId)
        chatIo.sockets.to(connectedUsers[data.groupChatId]).emit('incoming_group_message', data.message);

      if (data.groupChatId) {
        const chat = await Chat.findById(data.groupChatId);

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
            // TODO: Only if user is not online
            inbox: [...chat.inbox, data.messageId],
          });

          if (!messageStored)
            chatIo.sockets.to(connectedUsers[data.senderId]).emit('message_store_error', 'Failed to store message');
        }
      } else {
        const chatCreated = await Chat.create({
          type: ChatType.Group,
          members: data.members?.split(','),
          totalMessages: [
            {
              messageId: data.messageId,
              sender: data.senderId,
              message: data.message,
              timestamp: Date.parse(data.timeStamp),
            },
          ],
          // TODO: Only if user is not online
          inbox: [data.messageId],
        });

        if (!chatCreated)
          chatIo.sockets.to(connectedUsers[data.senderId]).emit('group_chat_error', 'Failed to create group chat');
        else
          chatIo.sockets
            .to(connectedUsers[data.senderId])
            .emit('receive_group_chat_id', { chatId: chatCreated.id, members: data.members });
      }
    },
  );

  socket.on('mark-read', async (chatId: string) => {
    const chat = await Chat.findById(chatId);

    if (chat) {
      await chat.updateOne({
        inbox: [],
      });
    }
  });
};

/**
 * Get Messages
 * @route GET /api/v1/messaging/:userId
 * @access Private
 */
const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const messages = await Chat.find({ members: { $in: [userId] } });

  if (messages) {
    res.json({
      messages,
      connectedUsers,
    });
  } else {
    res.status(404);
    throw new Error('Messages not found');
  }
});

/**
 * Get Last seen data
 * @route POST /api/v1/messaging/lastSeen
 * @access Private
 */
const getLastSeen = asyncHandler(async (req: Request, res: Response) => {
  const { userIds } = req.body as { userIds: string };
  const users = userIds.split(',');

  await new Promise((resolve, _reject) => {
    const lastSeenStatuses: { userId: string; isOnline?: boolean; lastSeen?: Date }[] = [];

    users.forEach(async (userId, index) => {
      if (userId.length !== 0) {
        const user = await User.findById(userId);
        const userJson = {
          userId,
          userName: `${user?.firstName} ${user?.lastName}`,
          isOnline: user?.isOnline,
          lastSeen: user?.lastSeen,
        };

        lastSeenStatuses.push(userJson);
      }

      if (index === users.length - 2) resolve(lastSeenStatuses);
    });
  }).then((lastSeenStatuses) => {
    console.log(lastSeenStatuses);
    res.json(lastSeenStatuses);
  });
});

export { messagingSocket, getMessages, getLastSeen };
