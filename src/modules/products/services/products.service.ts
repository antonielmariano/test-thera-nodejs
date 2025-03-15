import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from '../dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts() {
    return this.prisma.product.findMany({
      include: {
        category: true
      }
    });
  }

  async getProductById(id: string) {
    const productId = BigInt(id);
    return this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true
      }
    });
  }

  async createProduct(data: CreateProductDto) {
    return this.prisma.product.create({
      data,
      include: {
        category: true
      }
    });
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    const productId = BigInt(id);
    return this.prisma.product.update({
      where: { id: productId },
      data,
      include: {
        category: true
      }
    });
  }

  async deleteProduct(id: string) {
    const productId = BigInt(id);
    return this.prisma.product.delete({
      where: { id: productId }
    });
  }

  async getProductsByCategory(categoryId: number) {
    return this.prisma.product.findMany({
      where: {
        categoryId
      },
      include: {
        category: true
      }
    });
  }

  async searchProducts(searchTerm: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      include: {
        category: true
      }
    });
  }
}