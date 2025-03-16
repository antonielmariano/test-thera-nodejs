import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/categories.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories() {
    return await this.prisma.category.findMany({
      include: {
        products: true,
      },
    });
  }

  async findUniqueCategoryById(id: number, includeProducts: boolean) {
    return await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: includeProducts,
      },
    });
  }

  async createCategory(data: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: {
        name: data.name,
      },
      include: {
        products: true,
      },
    });
  }

  async updateCategory(id: number, data: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name })
        },
        include: {
          products: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
  async deleteCategory(id: number) {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      throw error;
    }
  }
}


