import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { StatusModule } from './modules/status/status.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    OrdersModule,
    ProductsModule,
    AuthModule,
    StatusModule,
    UserModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
