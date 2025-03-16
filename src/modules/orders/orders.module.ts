import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { OrderRepository } from './repositories/orders.repository';
import { StatusRepository } from '../status/repositories/status.repository';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository, StatusRepository],
})
export class OrdersModule {}