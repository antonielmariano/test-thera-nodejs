import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../dtos/products.dto';
import { ProductRepository } from '../repositories/products.repository';
import { CategoryRepository } from 'src/modules/categories/repositories/categories.repository';

@Injectable()
export class ProductsService {
  constructor(
    private productRepository: ProductRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async getAllProducts() {
    return this.productRepository.getAllProducts();
  }

  async getProductById(id: string) {
    const productId = BigInt(id);
    const product = await this.productRepository.getProductById(productId);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async createProduct(data: CreateProductDto) {
    const categoryExists = await this.categoryRepository.findUniqueCategoryById(
      data.categoryId,
      false,
    );

    if (!categoryExists) {
      throw new NotFoundException(`Category with ID ${data.categoryId} not found`);
    }

    return this.productRepository.createProduct(data, true);
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    if (data.categoryId) {
      const categoryExists = await this.categoryRepository.findUniqueCategoryById(
          data.categoryId,
          false,
        );

      if (!categoryExists) {
        throw new NotFoundException(`Category with ID ${data.categoryId} not found`);
      }
    }

    try {
      const productId = BigInt(id);
      return await this.productRepository.updateProduct(data, productId, false);
    } catch (error) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async deleteProduct(id: string) {
    try {
      const productId = BigInt(id);
      return await this.productRepository.deleteProduct(productId);
    } catch (error) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async getProductsByCategory(categoryId: number) {
    const categoryExists = await this.categoryRepository.findUniqueCategoryById(
      categoryId,
      false,
    );

    if (!categoryExists) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return this.productRepository.findProductsByCategoryId(categoryId);
  }

  async searchProducts(searchTerm: string) {
    return this.productRepository.findProductsSearchTerm(searchTerm);
  }
}
