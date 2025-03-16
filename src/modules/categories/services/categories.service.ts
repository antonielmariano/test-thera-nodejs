import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/categories.dto';
import { CategoryRepository } from '../repositories/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private categoryRepository: CategoryRepository) {}

  async getAllCategories() {
    return this.categoryRepository.getAllCategories();
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepository.findUniqueCategoryById(id, true);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async createCategory(data: CreateCategoryDto) {
    return await this.categoryRepository.createCategory(data);
  }

  async updateCategory(id: number, data: UpdateCategoryDto) {
    return await this.categoryRepository.updateCategory(id, data);
  }

  async deleteCategory(id: number) {
    return await this.categoryRepository.deleteCategory(id);
  }
}
