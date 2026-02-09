import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AdminAuthGuard } from '../admin/admin-auth.guard';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-production',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [TrackingController],
  providers: [TrackingService, AdminAuthGuard],
  exports: [TrackingService],
})
export class TrackingModule {}
