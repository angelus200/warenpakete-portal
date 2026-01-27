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
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const sessionToken = authHeader.substring(7);

    try {
      const sessionClaims = await this.clerk.sessions.verifySession(
        sessionToken,
        sessionToken,
      );

      if (!sessionClaims) {
        throw new UnauthorizedException('Invalid session');
      }

      request.user = {
        clerkId: sessionClaims.userId,
        sessionId: sessionClaims.id,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
