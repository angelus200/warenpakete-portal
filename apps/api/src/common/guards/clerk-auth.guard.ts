import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Clerk } from '@clerk/backend';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
      throw new UnauthorizedException('Empty token');
    }

    try {
      // Validate JWT format (must have 3 parts)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new UnauthorizedException('Invalid token format - not a JWT');
      }

      // Decode JWT to get session ID
      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64').toString(),
      );

      if (!payload || !payload.sub || !payload.sid) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Verify the session using Clerk
      const session = await this.clerk.sessions.getSession(payload.sid);

      if (!session || session.status !== 'active') {
        throw new UnauthorizedException('Invalid or expired session');
      }

      // CRITICAL: Get user from database to get the actual user.id (not just clerkId)
      const user = await this.prisma.user.findUnique({
        where: { clerkId: payload.sub },
        select: { id: true, clerkId: true, email: true, role: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = {
        id: user.id,           // Database UUID - THIS IS CRITICAL for filtering!
        clerkId: user.clerkId, // Clerk ID for reference
        email: user.email,     // Email for logging
        role: user.role,       // User role for authorization
        sessionId: payload.sid,
      };

      return true;
    } catch (error) {
      console.error('❌ Clerk token verification failed:', error.message);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
