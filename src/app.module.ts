import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
//import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, OrdersModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
