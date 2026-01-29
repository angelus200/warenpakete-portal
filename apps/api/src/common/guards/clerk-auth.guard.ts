import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Clerk } from '@clerk/backend';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      // Decode JWT to get session ID
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString(),
      );

      if (!payload || !payload.sub || !payload.sid) {
        throw new UnauthorizedException('Invalid token format');
      }

      // Verify the session using Clerk
      const session = await this.clerk.sessions.getSession(payload.sid);

      if (!session || session.status !== 'active') {
        throw new UnauthorizedException('Invalid or expired session');
      }

      request.user = {
        clerkId: payload.sub,
        sessionId: payload.sid,
      };

      return true;
    } catch (error) {
      console.error('Clerk token verification failed:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
