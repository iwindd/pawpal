import { AppController } from '@/modules/app/app.controller';
import { AppService } from '@/modules/app/app.service';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CarouselModule } from '../carousel/carousel.module';
import { CategoryModule } from '../category/category.module';
import { NotificationModule } from '../notification/notification.module';
import { OrderModule } from '../order/order.module';
import { PackageModule } from '../package/package.module';
import { PaymentModule } from '../payment/payment.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductModule } from '../product/product.module';
import { ProductTagModule } from '../productTags/product-tag.module';
import { ResourceModule } from '../resource/resource.module';
import { SaleModule } from '../sale/sale.module';
import { WalletModule } from '../wallet/wallet.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`, '../../.env'],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    ProductModule,
    ProductTagModule,
    SaleModule,
    PaymentModule,
    WalletModule,
    OrderModule,
    PackageModule,
    ResourceModule,
    CarouselModule,
    CategoryModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
