import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ProductsModule } from '../products/products.module';
import { CommissionsModule } from '../commissions/commissions.module';
import { UsersModule } from '../users/users.module';
import { ContractsModule } from '../contracts/contracts.module';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [ProductsModule, CommissionsModule, UsersModule, ContractsModule, InvoicesModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
