import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UserService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dtos/users.dto';
import { ForbiddenException } from '@nestjs/common';

// Mock completo do UserService para evitar dependências externas
jest.mock('../services/users.service');

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    createUser: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
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

  const mockUserResponse: UserResponseDto = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    isAdmin: true,
    createdAt: new Date(),
  };

  const mockNonAdminUserResponse: UserResponseDto = {
    id: 2,
    email: 'user@example.com',
    name: 'Regular User',
    isAdmin: false,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      };
      
      const expectedResponse: UserResponseDto = {
        id: 3,
        email: 'new@example.com',
        name: 'New User',
        isAdmin: false,
        createdAt: new Date(),
      };

      mockUserService.createUser.mockResolvedValue(expectedResponse);

      const result = await controller.createUser(createUserDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getMyProfile', () => {
    it('should return the current user profile', async () => {
      mockUserService.getUserById.mockResolvedValue(mockUserResponse);

      const result = await controller.getMyProfile(mockUser);

      expect(result).toEqual(mockUserResponse);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id when requested by the same user', async () => {
      mockUserService.getUserById.mockResolvedValue(mockUserResponse);

      const result = await controller.getUserById(mockUser.id, mockUser);

      expect(result).toEqual(mockUserResponse);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUser.id);
    });

    it('should return a user by id when requested by an admin', async () => {
      mockUserService.getUserById.mockResolvedValue(mockNonAdminUserResponse);

      const result = await controller.getUserById(mockNonAdminUser.id, mockUser);

      expect(result).toEqual(mockNonAdminUserResponse);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockNonAdminUser.id);
    });

    it('should throw ForbiddenException when non-admin tries to access another user profile', async () => {
      try {
        await controller.getUserById(mockUser.id, mockNonAdminUser);
        // Se chegar aqui, o teste falhou
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Unauthorized to access this user profile');
      }
      
      expect(mockUserService.getUserById).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update user when requested by the same user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };
      
      const expectedResponse: UserResponseDto = {
        ...mockUserResponse,
        name: 'Updated Name',
      };

      mockUserService.updateUser.mockResolvedValue(expectedResponse);

      const result = await controller.updateUser(mockUser.id, updateUserDto, mockUser);

      expect(result).toEqual(expectedResponse);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(mockUser.id, updateUserDto);
    });

    it('should update user when requested by an admin', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated By Admin',
      };
      
      const expectedResponse: UserResponseDto = {
        ...mockNonAdminUserResponse,
        name: 'Updated By Admin',
      };

      mockUserService.updateUser.mockResolvedValue(expectedResponse);

      const result = await controller.updateUser(mockNonAdminUser.id, updateUserDto, mockUser);

      expect(result).toEqual(expectedResponse);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(mockNonAdminUser.id, updateUserDto);
    });

    it('should throw ForbiddenException when non-admin tries to update another user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Unauthorized Update',
      };

      try {
        await controller.updateUser(mockUser.id, updateUserDto, mockNonAdminUser);
        // Se chegar aqui, o teste falhou
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Unauthorized to update this user');
      }
      
      expect(mockUserService.updateUser).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when non-admin tries to grant admin privileges', async () => {
      const updateUserDto: UpdateUserDto = {
        isAdmin: true,
      };

      try {
        await controller.updateUser(mockNonAdminUser.id, updateUserDto, mockNonAdminUser);
        // Se chegar aqui, o teste falhou
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Only administrators can grant admin privileges');
      }
      
      expect(mockUserService.updateUser).not.toHaveBeenCalled();
    });
  });
}); 