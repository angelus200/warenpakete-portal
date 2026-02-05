import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CrmController } from './crm.controller';
import { CrmService } from './crm.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: false,
      secret: process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-production',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [CrmController],
  providers: [CrmService],
  exports: [CrmService],
})
export class CrmModule {}
