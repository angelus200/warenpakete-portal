import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create new chat room (User)
   */
  async createRoom(userId: string, userEmail: string, userName: string, subject: string) {
    return this.prisma.chatRoom.create({
      data: {
        userId,
        userEmail,
        userName,
        subject,
        status: 'OPEN',
      },
    });
  }

  /**
   * Get user's chat rooms (User)
   */
  async getUserRooms(userId: string) {
    const rooms = await this.prisma.chatRoom.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return rooms.map(room => ({
      ...room,
      lastMessage: room.messages[0] || null,
      unreadCount: 0, // Will be calculated if needed
    }));
  }

  /**
   * Get messages for a specific room (User)
   */
  async getRoomMessages(roomId: string, userId: string) {
    // Verify the room belongs to the user
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Chat-Raum nicht gefunden');
    }

    if (room.userId !== userId) {
      throw new ForbiddenException('Sie haben keine Berechtigung, diesen Chat zu sehen');
    }

    // Mark admin messages as read
    await this.prisma.chatMessage.updateMany({
      where: {
        roomId,
        senderType: 'ADMIN',
        read: false,
      },
      data: { read: true },
    });

    return this.prisma.chatMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Send message (User)
   */
  async sendMessage(roomId: string, userId: string, senderName: string, message: string) {
    // Verify the room belongs to the user
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Chat-Raum nicht gefunden');
    }

    if (room.userId !== userId) {
      throw new ForbiddenException('Sie haben keine Berechtigung, in diesem Chat zu schreiben');
    }

    // Create message and update room timestamp
    const [chatMessage] = await this.prisma.$transaction([
      this.prisma.chatMessage.create({
        data: {
          roomId,
          senderType: 'USER',
          senderName,
          message,
        },
      }),
      this.prisma.chatRoom.update({
        where: { id: roomId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return chatMessage;
  }

  /**
   * Get all chat rooms (Admin)
   */
  async getAllRooms() {
    const rooms = await this.prisma.chatRoom.findMany({
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: {
                senderType: 'USER',
                read: false,
              },
            },
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // OPEN first
        { updatedAt: 'desc' },
      ],
    });

    return rooms.map(room => ({
      ...room,
      lastMessage: room.messages[0] || null,
      unreadCount: room._count.messages,
    }));
  }

  /**
   * Get messages for admin
   */
  async getAdminRoomMessages(roomId: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Chat-Raum nicht gefunden');
    }

    // Mark user messages as read
    await this.prisma.chatMessage.updateMany({
      where: {
        roomId,
        senderType: 'USER',
        read: false,
      },
      data: { read: true },
    });

    return this.prisma.chatMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Send message as admin
   */
  async sendAdminMessage(roomId: string, message: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Chat-Raum nicht gefunden');
    }

    // Create message and update room timestamp
    const [chatMessage] = await this.prisma.$transaction([
      this.prisma.chatMessage.create({
        data: {
          roomId,
          senderType: 'ADMIN',
          senderName: 'Support Team',
          message,
        },
      }),
      this.prisma.chatRoom.update({
        where: { id: roomId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return chatMessage;
  }

  /**
   * Close chat room (Admin)
   */
  async closeRoom(roomId: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Chat-Raum nicht gefunden');
    }

    return this.prisma.chatRoom.update({
      where: { id: roomId },
      data: { status: 'CLOSED' },
    });
  }
}
