import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { OrdersModule } from '../orders/orders.module';
import { EmailModule } from '../email/email.module';
import { AffiliateModule } from '../affiliate/affiliate.module';

@Module({
  imports: [OrdersModule, EmailModule, AffiliateModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
