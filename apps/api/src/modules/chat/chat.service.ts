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

  /**
   * Admin starts new chat with a user
   */
  async createAdminRoom(userId: string, subject: string, firstMessage: string, roomType: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (!user) {
      throw new NotFoundException('Benutzer nicht gefunden');
    }

    const userName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

    // Create room + first message in transaction
    const room = await this.prisma.$transaction(async (tx) => {
      const newRoom = await tx.chatRoom.create({
        data: {
          userId: user.id,
          userEmail: user.email,
          userName,
          subject,
          status: 'OPEN',
          roomType: roomType as any,
          initiatedBy: 'ADMIN',
        },
      });

      await tx.chatMessage.create({
        data: {
          roomId: newRoom.id,
          senderType: 'ADMIN',
          senderName: 'Support Team',
          message: firstMessage,
        },
      });

      return newRoom;
    });

    return room;
  }

  /**
   * Search users for admin chat initiation
   */
  async searchUsers(query: string) {
    const where: any = {};

    if (query) {
      where.OR = [
        { email: { contains: query, mode: 'insensitive' } },
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
      take: 20,
      orderBy: { email: 'asc' },
    });

    // Check which users have affiliate links
    const userIds = users.map(u => u.id);
    const affiliates = await this.prisma.affiliateLink.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, code: true },
    });
    const affiliateMap = new Map(affiliates.map(a => [a.userId, a.code]));

    return users.map(user => ({
      ...user,
      isAffiliate: affiliateMap.has(user.id),
      affiliateCode: affiliateMap.get(user.id) || null,
      displayName: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email,
    }));
  }
}
