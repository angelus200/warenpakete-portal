import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FunnelController } from './funnel.controller';
import { FunnelService } from './funnel.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    JwtModule.register({
      global: false,
      secret: process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-production',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [FunnelController],
  providers: [FunnelService],
  exports: [FunnelService],
})
export class FunnelModule {}
