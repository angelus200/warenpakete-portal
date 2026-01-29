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

    console.log('🔐 Auth Guard - Checking authorization...');

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('❌ No Bearer token in Authorization header');
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
      console.log('❌ Empty token after Bearer prefix');
      throw new UnauthorizedException('Empty token');
    }

    console.log('🔍 Token received:', token.substring(0, 20) + '...');

    try {
      // Validate JWT format (must have 3 parts)
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('❌ Invalid JWT format. Parts:', parts.length);
        throw new UnauthorizedException('Invalid token format - not a JWT');
      }

      // Decode JWT to get session ID
      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64').toString(),
      );

      console.log('✅ Token decoded. Payload keys:', Object.keys(payload).join(', '));

      if (!payload || !payload.sub || !payload.sid) {
        console.log('❌ Missing required fields in token. Has sub:', !!payload?.sub, 'Has sid:', !!payload?.sid);
        throw new UnauthorizedException('Invalid token payload');
      }

      console.log('🔍 Verifying session with Clerk:', payload.sid.substring(0, 20) + '...');

      // Verify the session using Clerk
      const session = await this.clerk.sessions.getSession(payload.sid);

      console.log('📋 Session status:', session?.status);

      if (!session || session.status !== 'active') {
        console.log('❌ Session invalid or not active');
        throw new UnauthorizedException('Invalid or expired session');
      }

      request.user = {
        clerkId: payload.sub,
        sessionId: payload.sid,
      };

      console.log('✅ Auth successful for user:', payload.sub);

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
