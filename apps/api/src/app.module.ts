import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CommissionsModule } from './modules/commissions/commissions.module';
import { EmailModule } from './modules/email/email.module';
import { StorageModule } from './modules/storage/storage.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { AdminModule } from './modules/admin/admin.module';
import { CrmModule } from './modules/crm/crm.module';
import { AffiliateModule } from './modules/affiliate/affiliate.module';
import { ChatModule } from './modules/chat/chat.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { FunnelModule } from './modules/funnel/funnel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PrismaModule,
    EmailModule,
    StorageModule,
    WalletModule,
    InvoicesModule,
    ContractsModule,
    AdminModule,
    CrmModule,
    AffiliateModule,
    ChatModule,
    TrackingModule,
    FunnelModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    CommissionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
