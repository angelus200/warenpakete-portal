import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * USER: Create new chat room
   */
  @Post('rooms')
  @UseGuards(ClerkAuthGuard)
  async createRoom(@Req() req, @Body() body: { subject: string }) {
    const userName = req.user.email?.split('@')[0] || 'User';
    return this.chatService.createRoom(
      req.user.id,
      req.user.email,
      userName,
      body.subject,
    );
  }

  /**
   * USER: Get my chat rooms
   */
  @Get('rooms/my')
  @UseGuards(ClerkAuthGuard)
  async getMyRooms(@Req() req) {
    return this.chatService.getUserRooms(req.user.id);
  }

  /**
   * USER: Get messages for a room
   */
  @Get('rooms/:id/messages')
  @UseGuards(ClerkAuthGuard)
  async getRoomMessages(@Req() req, @Param('id') roomId: string) {
    return this.chatService.getRoomMessages(roomId, req.user.id);
  }

  /**
   * USER: Send message to room
   */
  @Post('rooms/:id/messages')
  @UseGuards(ClerkAuthGuard)
  async sendMessage(
    @Req() req,
    @Param('id') roomId: string,
    @Body() body: { message: string },
  ) {
    const senderName = req.user.email?.split('@')[0] || 'User';
    return this.chatService.sendMessage(
      roomId,
      req.user.id,
      senderName,
      body.message,
    );
  }

  /**
   * ADMIN: Get all chat rooms
   */
  @Get('admin/rooms')
  @UseGuards(ClerkAuthGuard)
  async getAllRooms(@Req() req) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Nur Administratoren haben Zugriff');
    }
    return this.chatService.getAllRooms();
  }

  /**
   * ADMIN: Get messages for a room
   */
  @Get('admin/rooms/:id/messages')
  @UseGuards(ClerkAuthGuard)
  async getAdminRoomMessages(@Req() req, @Param('id') roomId: string) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Nur Administratoren haben Zugriff');
    }
    return this.chatService.getAdminRoomMessages(roomId);
  }

  /**
   * ADMIN: Send message to room
   */
  @Post('admin/rooms/:id/messages')
  @UseGuards(ClerkAuthGuard)
  async sendAdminMessage(
    @Req() req,
    @Param('id') roomId: string,
    @Body() body: { message: string },
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Nur Administratoren haben Zugriff');
    }
    return this.chatService.sendAdminMessage(roomId, body.message);
  }

  /**
   * ADMIN: Close chat room
   */
  @Patch('admin/rooms/:id/close')
  @UseGuards(ClerkAuthGuard)
  async closeRoom(@Req() req, @Param('id') roomId: string) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Nur Administratoren haben Zugriff');
    }
    return this.chatService.closeRoom(roomId);
  }
}
