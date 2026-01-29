import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ProductsModule } from '../products/products.module';
import { CommissionsModule } from '../commissions/commissions.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ProductsModule, CommissionsModule, UsersModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
