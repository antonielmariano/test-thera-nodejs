import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from '../dtos/products.dto';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts() {
    return await this.prisma.product.findMany({
      include: {
        category: true,
      },
    });
  }

  async getProductById(id: bigint) {
    return await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async createProduct(data: CreateProductDto, includesCategory: boolean) {
    return await this.prisma.product.create({
      data,
      include: {
        category: includesCategory,
      },
    });
  }

  async updateProduct(
    data: UpdateProductDto,
    id: bigint,
    includesCategory: boolean,
  ) {
    return await this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: includesCategory,
      },
    });
  }

  async deleteProduct(id: bigint) {
    return await this.prisma.product.delete({
      where: { id },
    });
  }

  async findProductsByCategoryId(categoryId: number) {
    return await this.prisma.product.findMany({
      where: {
        categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  async findProductsSearchTerm(searchTerm: string) {
    return await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
      },
    });
  }
}
