import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductRepository } from './repositories/products.repository';
import { CategoryRepository } from '../categories/repositories/categories.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository, CategoryRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
