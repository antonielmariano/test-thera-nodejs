import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from '../services/products.service';
import { CreateProductDto, UpdateProductDto } from '../dtos/products.dto';
import { ForbiddenException } from '@nestjs/common';

// Mock completo do ProductsService para evitar dependências externas
jest.mock('../services/products.service');

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    searchProducts: jest.fn(),
    getProductsByCategory: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    isAdmin: true,
  };

  const mockNonAdminUser = {
    id: 2,
    email: 'user@example.com',
    name: 'Regular User',
    isAdmin: false,
  };

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    stockQuantity: 10,
    categoryId: 1,
    category: {
      id: 1,
      name: 'Test Category',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const products = [mockProduct];
      mockProductsService.getAllProducts.mockResolvedValue(products);

      const result = await controller.getAllProducts(mockUser);

      expect(result).toEqual(products);
      expect(mockProductsService.getAllProducts).toHaveBeenCalled();
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      mockProductsService.getProductById.mockResolvedValue(mockProduct);

      const result = await controller.getProductById('1', mockUser);

      expect(result).toEqual(mockProduct);
      expect(mockProductsService.getProductById).toHaveBeenCalledWith('1');
    });
  });

  describe('searchProducts', () => {
    it('should return products matching the search term', async () => {
      const products = [mockProduct];
      const searchTerm = 'Test';
      mockProductsService.searchProducts.mockResolvedValue(products);

      const result = await controller.searchProducts(searchTerm, mockUser);

      expect(result).toEqual(products);
      expect(mockProductsService.searchProducts).toHaveBeenCalledWith(searchTerm);
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products by category id', async () => {
      const products = [mockProduct];
      const categoryId = 1;
      mockProductsService.getProductsByCategory.mockResolvedValue(products);

      const result = await controller.getProductsByCategory(categoryId, mockUser);

      expect(result).toEqual(products);
      expect(mockProductsService.getProductsByCategory).toHaveBeenCalledWith(categoryId);
    });
  });

  describe('createProduct', () => {
    it('should create a product when user is admin', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        description: 'New Description',
        price: 200,
        stockQuantity: 20,
        categoryId: 1,
      };
      mockProductsService.createProduct.mockResolvedValue({
        id: '2',
        ...createProductDto,
      });

      const result = await controller.createProduct(createProductDto, mockUser);

      expect(result).toEqual({
        id: '2',
        ...createProductDto,
      });
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(createProductDto);
    });

    it('should throw ForbiddenException when non-admin user tries to create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        description: 'New Description',
        price: 200,
        stockQuantity: 20,
        categoryId: 1,
      };

      try {
        await controller.createProduct(createProductDto, mockNonAdminUser);
        // Se chegar aqui, o teste falhou
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Only administrators can create products');
      }
      
      expect(mockProductsService.createProduct).not.toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('should update a product when user is admin', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 150,
      };
      mockProductsService.updateProduct.mockResolvedValue({
        id: '1',
        name: 'Updated Product',
        description: 'Test Description',
        price: 150,
        stockQuantity: 10,
        categoryId: 1,
      });

      const result = await controller.updateProduct('1', updateProductDto, mockUser);

      expect(result).toEqual({
        id: '1',
        name: 'Updated Product',
        description: 'Test Description',
        price: 150,
        stockQuantity: 10,
        categoryId: 1,
      });
      expect(mockProductsService.updateProduct).toHaveBeenCalledWith('1', updateProductDto);
    });

    it('should throw ForbiddenException when non-admin user tries to update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 150,
      };

      try {
        await controller.updateProduct('1', updateProductDto, mockNonAdminUser);
        // Se chegar aqui, o teste falhou
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Only administrators can update products');
      }
      
      expect(mockProductsService.updateProduct).not.toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product when user is admin', async () => {
      mockProductsService.deleteProduct.mockResolvedValue({ id: '1' });

      const result = await controller.deleteProduct('1', mockUser);

      expect(result).toEqual({ id: '1' });
      expect(mockProductsService.deleteProduct).toHaveBeenCalledWith('1');
    });

    it('should throw ForbiddenException when non-admin user tries to delete a product', async () => {
      try {
        await controller.deleteProduct('1', mockNonAdminUser);
        // Se chegar aqui, o teste falhou
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Only administrators can delete products');
      }
      
      expect(mockProductsService.deleteProduct).not.toHaveBeenCalled();
    });
  });
}); 