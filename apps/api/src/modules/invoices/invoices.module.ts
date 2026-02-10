import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { PdfGeneratorService } from './pdf-generator.service';
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
  controllers: [InvoicesController],
  providers: [InvoicesService, PdfGeneratorService, AdminAuthGuard],
  exports: [InvoicesService],
})
export class InvoicesModule {}
