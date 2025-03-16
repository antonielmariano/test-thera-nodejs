import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';
import { StatusService } from '../services/status.service';
import { CreateStatusDto, UpdateStatusDto } from '../dtos/status.dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { StatusEnum } from '../enums/status.enum';

// Mock completo do StatusService para evitar dependências externas
jest.mock('../services/status.service');

describe('StatusController', () => {
  let controller: StatusController;
  let service: StatusService;

  const mockStatusService = {
    getAllStatuses: jest.fn(),
    getStatusFlow: jest.fn(),
    getStatusById: jest.fn(),
    createStatus: jest.fn(),
    updateStatus: jest.fn(),
    deleteStatus: jest.fn(),
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

  const mockStatus = {
    id: 1,
    name: 'Pending',
    description: 'Order is pending',
    isFinal: false,
    nextStatusId: 2,
  };

  const mockStatusFlow = [
    {
      id: 1,
      name: 'Pending',
      description: 'Order is pending',
      isFinal: false,
      nextStatusId: 2,
    },
    {
      id: 2,
      name: 'Processing',
      description: 'Order is being processed',
      isFinal: false,
      nextStatusId: 3,
    },
    {
      id: 3,
      name: 'Completed',
      description: 'Order is completed',
      isFinal: true,
      nextStatusId: null,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [
        {
          provide: StatusService,
          useValue: mockStatusService,
        },
      ],
    }).compile();

    controller = module.get<StatusController>(StatusController);
    service = module.get<StatusService>(StatusService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllStatuses', () => {
    it('should return an array of statuses', async () => {
      const statuses = [mockStatus];
      mockStatusService.getAllStatuses.mockResolvedValue(statuses);

      const result = await controller.getAllStatuses(mockAdminUser);

      expect(result).toEqual(statuses);
      expect(mockStatusService.getAllStatuses).toHaveBeenCalled();
    });
  });

  describe('getStatusFlow', () => {
    it('should return the status flow', async () => {
      mockStatusService.getStatusFlow.mockResolvedValue(mockStatusFlow);

      const result = await controller.getStatusFlow(mockAdminUser);

      expect(result).toEqual(mockStatusFlow);
      expect(mockStatusService.getStatusFlow).toHaveBeenCalled();
    });
  });

  describe('getStatusById', () => {
    it('should return a status by id', async () => {
      mockStatusService.getStatusById.mockResolvedValue(mockStatus);

      const result = await controller.getStatusById(1, mockAdminUser);

      expect(result).toEqual(mockStatus);
      expect(mockStatusService.getStatusById).toHaveBeenCalledWith(1);
    });
  });

  describe('getStatusByEnum', () => {
    it('should return a status by enum type', async () => {
      mockStatusService.getStatusById.mockResolvedValue(mockStatus);

      const result = await controller.getStatusByEnum('PENDING', mockAdminUser);

      expect(result).toEqual(mockStatus);
      expect(mockStatusService.getStatusById).toHaveBeenCalledWith(StatusEnum.PENDING);
    });

    it('should throw BadRequestException when invalid enum type is provided', async () => {
      try {
        await controller.getStatusByEnum('INVALID_TYPE' as any, mockAdminUser);
        // Se chegar aqui, o teste falhou
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid status type: INVALID_TYPE');
      }
      
      expect(mockStatusService.getStatusById).not.toHaveBeenCalled();
    });
  });

  describe('createStatus', () => {
    it('should create a status when user is admin', async () => {
      const createStatusDto: CreateStatusDto = {
        name: 'New Status',
        description: 'New status description',
        isFinal: false,
        nextStatusId: 2,
      };
      
      mockStatusService.createStatus.mockResolvedValue({
        id: 4,
        ...createStatusDto,
      });

      const result = await controller.createStatus(createStatusDto, mockAdminUser);

      expect(result).toEqual({
        id: 4,
        ...createStatusDto,
      });
      expect(mockStatusService.createStatus).toHaveBeenCalledWith(createStatusDto);
    });

    it('should throw ForbiddenException when non-admin user tries to create a status', async () => {
      const createStatusDto: CreateStatusDto = {
        name: 'New Status',
        description: 'New status description',
        isFinal: false,
        nextStatusId: 2,
      };

      try {
        await controller.createStatus(createStatusDto, mockNonAdminUser);
        // Se chegar aqui, o teste falhou
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Only administrators can create status');
      }
      
      expect(mockStatusService.createStatus).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update a status when user is admin', async () => {
      const updateStatusDto: UpdateStatusDto = {
        name: 'Updated Status',
        description: 'Updated status description',
      };
      
      mockStatusService.updateStatus.mockResolvedValue({
        id: 1,
        name: 'Updated Status',
        description: 'Updated status description',
        isFinal: false,
        nextStatusId: 2,
      });

      const result = await controller.updateStatus(1, updateStatusDto, mockAdminUser);

      expect(result).toEqual({
        id: 1,
        name: 'Updated Status',
        description: 'Updated status description',
        isFinal: false,
        nextStatusId: 2,
      });
      expect(mockStatusService.updateStatus).toHaveBeenCalledWith(1, updateStatusDto);
    });

    it('should throw ForbiddenException when non-admin user tries to update a status', async () => {
      const updateStatusDto: UpdateStatusDto = {
        name: 'Updated Status',
        description: 'Updated status description',
      };

      try {
        await controller.updateStatus(1, updateStatusDto, mockNonAdminUser);
        // Se chegar aqui, o teste falhou
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Only administrators can update status');
      }
      
      expect(mockStatusService.updateStatus).not.toHaveBeenCalled();
    });
  });

  describe('deleteStatus', () => {
    it('should delete a status when user is admin', async () => {
      mockStatusService.deleteStatus.mockResolvedValue({ id: 1 });

      const result = await controller.deleteStatus(1, mockAdminUser);

      expect(result).toEqual({ id: 1 });
      expect(mockStatusService.deleteStatus).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException when non-admin user tries to delete a status', async () => {
      try {
        await controller.deleteStatus(1, mockNonAdminUser);
        // Se chegar aqui, o teste falhou
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Only administrators can delete status');
      }
      
      expect(mockStatusService.deleteStatus).not.toHaveBeenCalled();
    });
  });
}); 