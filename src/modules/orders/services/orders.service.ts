import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOrderDto, OrderResponseDto } from '../dtos/orders.dto';
import { OrderRepository } from '../repositories/orders.repository';
import { StatusRepository } from 'src/modules/status/repositories/status.repository';

@Injectable()
export class OrdersService {
  constructor(
    private orderRepository: OrderRepository,
    private statusRepository: StatusRepository,
  ) {}

  async getAllOrders() {
    const orders = await this.orderRepository.getAllOrders();

    return this.transformOrdersToDto(orders);
  }

  async getOrdersByUser(userId: number) {
    const orders = await this.orderRepository.getOrdersByUserId(userId);

    return this.transformOrdersToDto(orders);
  }

  async getOrderById(id: string) {
    const orderId = BigInt(id);
    const order = await this.orderRepository.getOrderByOrderId(orderId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.transformOrderToDto(order);
  }

  async createOrder(data: CreateOrderDto, userId: number) {
    const productIds = data.orderProducts.map(p => BigInt(p.productId));

    const products = await this.orderRepository.verifyIfProductsExists(productIds);

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    const productsMap = new Map(products.map(p => [p.id.toString(), p]));

    let totalAmount = 0;

    for (const item of data.orderProducts) {
      const product = productsMap.get(item.productId);

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`
        );
      }

      // Calculate price for this item
      totalAmount += product.price * item.quantity;
    }

    // Round to 2 decimal places
    totalAmount = Math.round(totalAmount * 100) / 100;
    if (!product) {
      throw new NotFoundException(`Product with ID ${item.productId} not found`);
    }

    // Start a transaction
    const order = await this.orderRepository.createOrder(data, totalAmount, userId);

    return this.transformOrderToDto(order);
  }

  async getNextStatusId(currentStatusId: number): Promise<number | null> {
    const currentStatus = await this.statusRepository.getNextStatusId(currentStatusId, true);

    return currentStatus?.nextStatusId || null;
  }

  async updateOrderStatus(id: string, statusId: number) {
    const orderId = BigInt(id);
    const updatedOrder = await this.orderRepository.orderStatusUpdate(orderId, statusId);

    return this.transformOrderToDto(updatedOrder);
  }

  async advanceOrderStatus(id: string) {
    const orderId = BigInt(id);
    const order = await this.orderRepository.findByOrderId(orderId, true);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const nextStatusId = await this.getNextStatusId(order.statusId);

    if (!nextStatusId) {
      throw new BadRequestException('Order is already in its final status');
    }

    return this.updateOrderStatus(id, nextStatusId);
  }

  private transformOrderToDto(order: any): OrderResponseDto {
    return {
      ...order,
      id: order.id.toString(),
      orderProducts: order.orderProducts.map(op => ({
        ...op,
        id: op.id.toString(),
        productId: op.productId.toString(),
        product: {
          ...op.product,
          id: op.product.id.toString()
        }
      }))
    };
  }

  private transformOrdersToDto(orders: any[]): OrderResponseDto[] {
    return orders.map((order) => this.transformOrderToDto(order));
  }
}
