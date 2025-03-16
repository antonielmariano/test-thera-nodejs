import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/categories.dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CategoriesEnum } from '../enums/categories.enum';

// Mock completo do CategoriesService para evitar dependências externas
jest.mock('../services/categories.service');

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    getAllCategories: jest.fn(),
    getCategoryById: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
  };

  const mockAdminUser = {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin User',
    isAdmin: true,
  };

  const mockNonAdminUser = {
    id: 2,
    email: 'user@example.com',
    name: 'Regular User',
    isAdmin: false,
  };

  const mockCategory = {
    id: 1,
    name: 'Electronics',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('should return an array of categories', async () => {
      const categories = [mockCategory];
      mockCategoriesService.getAllCategories.mockResolvedValue(categories);

      const result = await controller.getAllCategories(mockAdminUser);

      expect(result).toEqual(categories);
      expect(mockCategoriesService.getAllCategories).toHaveBeenCalled();
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      mockCategoriesService.getCategoryById.mockResolvedValue(mockCategory);

      const result = await controller.getCategoryById(1, mockAdminUser);

      expect(result).toEqual(mockCategory);
      expect(mockCategoriesService.getCategoryById).toHaveBeenCalledWith(1);
    });
  });

  describe('getCategoryByEnum', () => {
    it('should return a category by enum type', async () => {
      mockCategoriesService.getCategoryById.mockResolvedValue(mockCategory);

      const result = await controller.getCategoryByEnum('ELECTRONICS', mockAdminUser);

      expect(result).toEqual(mockCategory);
      expect(mockCategoriesService.getCategoryById).toHaveBeenCalledWith(CategoriesEnum.ELECTRONICS);
    });

    it('should throw BadRequestException when invalid enum type is provided', async () => {
      try {
        await controller.getCategoryByEnum('INVALID_TYPE' as any, mockAdminUser);
        // Se chegar aqui, o teste falhou
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid category type: INVALID_TYPE');
      }
      
      expect(mockCategoriesService.getCategoryById).not.toHaveBeenCalled();
    });
  });

  describe('createCategory', () => {
    it('should create a category when user is admin', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'New Category',
      };
      
      mockCategoriesService.createCategory.mockResolvedValue({
        id: 2,
        ...createCategoryDto,
      });

      const result = await controller.createCategory(createCategoryDto, mockAdminUser);

      expect(result).toEqual({
        id: 2,
        ...createCategoryDto,
      });
      expect(mockCategoriesService.createCategory).toHaveBeenCalledWith(createCategoryDto);
    });

    it('should throw ForbiddenException when non-admin user tries to create a category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'New Category',
      };

      try {
        await controller.createCategory(createCategoryDto, mockNonAdminUser);
        // Se chegar aqui, o teste falhou
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Only administrators can create categories');
      }
      
      expect(mockCategoriesService.createCategory).not.toHaveBeenCalled();
    });
  });

  describe('updateCategory', () => {
    it('should update a category when user is admin', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };
      
      mockCategoriesService.updateCategory.mockResolvedValue({
        id: 1,
        name: 'Updated Category',
      });

      const result = await controller.updateCategory(1, updateCategoryDto, mockAdminUser);

      expect(result).toEqual({
        id: 1,
        name: 'Updated Category',
      });
      expect(mockCategoriesService.updateCategory).toHaveBeenCalledWith(1, updateCategoryDto);
    });

    it('should throw ForbiddenException when non-admin user tries to update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };

      try {
        await controller.updateCategory(1, updateCategoryDto, mockNonAdminUser);
        // Se chegar aqui, o teste falhou
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Only administrators can update categories');
      }
      
      expect(mockCategoriesService.updateCategory).not.toHaveBeenCalled();
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category when user is admin', async () => {
      mockCategoriesService.deleteCategory.mockResolvedValue({ id: 1 });

      const result = await controller.deleteCategory(1, mockAdminUser);

      expect(result).toEqual({ id: 1 });
      expect(mockCategoriesService.deleteCategory).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException when non-admin user tries to delete a category', async () => {
      try {
        await controller.deleteCategory(1, mockNonAdminUser);
        // Se chegar aqui, o teste falhou
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Only administrators can delete categories');
      }
      
      expect(mockCategoriesService.deleteCategory).not.toHaveBeenCalled();
    });
  });
}); 