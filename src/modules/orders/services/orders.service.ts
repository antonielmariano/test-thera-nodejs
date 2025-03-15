import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateOrderDto } from '../dtos/orders.dto';
import { OrderStatusType } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        status: true,
        user: true,
        orderProducts: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });
  }
  
  async getOrdersByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        status: true,
        user: true,
        orderProducts: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });
  }

  async getOrderById(id: string) {
    const orderId = BigInt(id);
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        status: true,
        user: true,
        orderProducts: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });
  }

  async createOrder(data: CreateOrderDto) {
    const orderProductsData = data.orderProducts.map(item => ({
      productId: BigInt(item.productId),
      quantity: item.quantity
    }));
    
    // criar funcao para calcular os preços
    // deixar status padrão pra pendoing
    // verificar a logica dos enumerators pra de alguma forma puxar o id
    // do jeito atual ta puxando so o type, fica meioque inutil

    return this.prisma.order.create({
      data: {
        totalAmount: data.totalAmount,
        statusId: OrderStatusType.PENDING,
        userId: data.userId, // mudar para receber pelo token
        orderProducts: {
          create: orderProductsData
        }
      },
      include: {
        status: true,
        user: true,
        orderProducts: {
          include: {
            product: true
          }
        }
      }
    });
  }

  async getNextStatusId(currentStatusId: number) {
    const currentStatus = await this.prisma.status.findUnique({
      where: { id: currentStatusId },
      select: { nextStatusId: true }
    });
    
    return currentStatus?.nextStatusId;
  }

  async updateOrderStatus(id: string, statusId: number) {
    const orderId = BigInt(id);
    return this.prisma.order.update({
      where: { id: orderId },
      data: { statusId },
      include: {
        status: true,
        user: true,
        orderProducts: {
          include: {
            product: true
          }
        }
      }
    });
  }

  async advanceOrderStatus(id: string) {
    const orderId = BigInt(id);
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { statusId: true }
    });
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    const nextStatusId = await this.getNextStatusId(order.statusId);
    
    if (!nextStatusId) {
      throw new Error('Order is already in its final status');
    }
    
    return this.updateOrderStatus(id, nextStatusId);
  }
}