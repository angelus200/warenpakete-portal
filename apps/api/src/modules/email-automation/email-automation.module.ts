import { Module } from '@nestjs/common';
import { EmailAutomationService } from './email-automation.service';
import { EmailAutomationController } from './email-automation.controller';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [EmailModule, PrismaModule],
  controllers: [EmailAutomationController],
  providers: [EmailAutomationService],
  exports: [EmailAutomationService],
})
export class EmailAutomationModule {}
