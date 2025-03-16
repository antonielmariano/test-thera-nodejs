import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto, OrderResponseDto } from '../dtos/orders.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Mock completo do OrdersService para evitar dependências externas
jest.mock('../services/orders.service');

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    getAllOrders: jest.fn(),
    getOrdersByUser: jest.fn(),
    getOrderById: jest.fn(),
    createOrder: jest.fn(),
    advanceOrderStatus: jest.fn(),
  };

  const mockAdminUser = {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin User',
    isAdmin: true,
  };

  const mockRegularUser = {
    id: 2,
    email: 'user@example.com',
    name: 'Regular User',
    isAdmin: false,
  };

  const mockOrder: OrderResponseDto = {
    id: '1',
    totalAmount: 100,
    statusId: 1,
    userId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: {
      id: 1,
      name: 'Pending',
      description: 'Order is pending',
      isFinal: false,
      nextStatusId: 2,
    },
    user: {
      id: 2,
      name: 'Regular User',
      email: 'user@example.com',
    },
    orderProducts: [
      {
        id: '1',
        productId: '1',
        quantity: 2,
        product: {
          id: '1',
          name: 'Test Product',
          description: 'Test Description',
          price: 50,
          stockQuantity: 10,
          categoryId: 1,
          category: {
            id: 1,
            name: 'Test Category',
          },
        },
      },
    ],
  };

  const mockAdminOrder: OrderResponseDto = {
    ...mockOrder,
    id: '2',
    userId: 1,
    user: {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllOrders', () => {
    it('should return all orders for admin users', async () => {
      const orders = [mockOrder, mockAdminOrder];
      mockOrdersService.getAllOrders.mockResolvedValue(orders);

      const result = await controller.getAllOrders(mockAdminUser);

      expect(result).toEqual(orders);
      expect(mockOrdersService.getAllOrders).toHaveBeenCalled();
      expect(mockOrdersService.getOrdersByUser).not.toHaveBeenCalled();
    });

    it('should return only user orders for non-admin users', async () => {
      const userOrders = [mockOrder];
      mockOrdersService.getOrdersByUser.mockResolvedValue(userOrders);

      const result = await controller.getAllOrders(mockRegularUser);

      expect(result).toEqual(userOrders);
      expect(mockOrdersService.getAllOrders).not.toHaveBeenCalled();
      expect(mockOrdersService.getOrdersByUser).toHaveBeenCalledWith(mockRegularUser.id);
    });
  });

  describe('getMyOrders', () => {
    it('should return orders for the current user', async () => {
      const userOrders = [mockOrder];
      mockOrdersService.getOrdersByUser.mockResolvedValue(userOrders);

      const result = await controller.getMyOrders(mockRegularUser);

      expect(result).toEqual(userOrders);
      expect(mockOrdersService.getOrdersByUser).toHaveBeenCalledWith(mockRegularUser.id);
    });
  });

  describe('getOrderById', () => {
    it('should return an order by id for the owner user', async () => {
      mockOrdersService.getOrderById.mockResolvedValue(mockOrder);

      const result = await controller.getOrderById('1', mockRegularUser);

      expect(result).toEqual(mockOrder);
      expect(mockOrdersService.getOrderById).toHaveBeenCalledWith('1');
    });

    it('should return an order by id for admin users', async () => {
      mockOrdersService.getOrderById.mockResolvedValue(mockOrder);

      const result = await controller.getOrderById('1', mockAdminUser);

      expect(result).toEqual(mockOrder);
      expect(mockOrdersService.getOrderById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when non-owner and non-admin tries to access an order', async () => {
      const otherUserOrder = {
        ...mockOrder,
        userId: 3,
      };
      mockOrdersService.getOrderById.mockResolvedValue(otherUserOrder);

      try {
        await controller.getOrderById('1', mockRegularUser);
        // Se chegar aqui, o teste falhou
        fail('Expected NotFoundException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Order not found');
      }
      
      expect(mockOrdersService.getOrderById).toHaveBeenCalledWith('1');
    });
  });

  describe('createOrder', () => {
    it('should create an order with valid data', async () => {
      const createOrderDto: CreateOrderDto = {
        orderProducts: [
          {
            productId: '1',
            quantity: 2,
          },
        ],
      };
      mockOrdersService.createOrder.mockResolvedValue(mockOrder);

      const result = await controller.createOrder(createOrderDto, mockRegularUser);

      expect(result).toEqual(mockOrder);
      expect(mockOrdersService.createOrder).toHaveBeenCalledWith(createOrderDto, mockRegularUser.id);
    });

    it('should throw BadRequestException when order has no products', async () => {
      const emptyOrderDto: CreateOrderDto = {
        orderProducts: [],
      };

      try {
        await controller.createOrder(emptyOrderDto, mockRegularUser);
        // Se chegar aqui, o teste falhou
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Order must contain at least one product');
      }
      
      expect(mockOrdersService.createOrder).not.toHaveBeenCalled();
    });
  });

  describe('advanceOrderStatus', () => {
    it('should advance order status for the owner user', async () => {
      const updatedOrder = {
        ...mockOrder,
        statusId: 2,
        status: {
          id: 2,
          name: 'Processing',
          description: 'Order is being processed',
          isFinal: false,
          nextStatusId: 3,
        },
      };
      mockOrdersService.getOrderById.mockResolvedValue(mockOrder);
      mockOrdersService.advanceOrderStatus.mockResolvedValue(updatedOrder);

      const result = await controller.advanceOrderStatus('1', mockRegularUser);

      expect(result).toEqual(updatedOrder);
      expect(mockOrdersService.getOrderById).toHaveBeenCalledWith('1');
      expect(mockOrdersService.advanceOrderStatus).toHaveBeenCalledWith('1');
    });

    it('should advance order status for admin users', async () => {
      const updatedOrder = {
        ...mockOrder,
        statusId: 2,
        status: {
          id: 2,
          name: 'Processing',
          description: 'Order is being processed',
          isFinal: false,
          nextStatusId: 3,
        },
      };
      mockOrdersService.getOrderById.mockResolvedValue(mockOrder);
      mockOrdersService.advanceOrderStatus.mockResolvedValue(updatedOrder);

      const result = await controller.advanceOrderStatus('1', mockAdminUser);

      expect(result).toEqual(updatedOrder);
      expect(mockOrdersService.getOrderById).toHaveBeenCalledWith('1');
      expect(mockOrdersService.advanceOrderStatus).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when non-owner and non-admin tries to advance order status', async () => {
      const otherUserOrder = {
        ...mockOrder,
        userId: 3,
      };
      mockOrdersService.getOrderById.mockResolvedValue(otherUserOrder);

      try {
        await controller.advanceOrderStatus('1', mockRegularUser);
        // Se chegar aqui, o teste falhou
        fail('Expected NotFoundException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Order not found');
      }
      
      expect(mockOrdersService.getOrderById).toHaveBeenCalledWith('1');
      expect(mockOrdersService.advanceOrderStatus).not.toHaveBeenCalled();
    });
  });
}); 