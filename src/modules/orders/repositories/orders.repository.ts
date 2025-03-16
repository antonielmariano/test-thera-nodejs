import { Injectable } from '@nestjs/common';
import { StatusEnum } from '../../status/enums/status.enum';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderDto } from '../dtos/orders.dto';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllOrders() {
    return await this.prisma.order.findMany({
      include: {
        status: true,
        user: true,
        orderProducts: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });
  }

  async getOrdersByUserId(userId: number) {
    return await this.prisma.order.findMany({
      where: { userId },
      include: {
        status: true,
        user: true,
        orderProducts: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });
  }

  async getOrderByOrderId(orderId: bigint) {
    return await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        status: true,
        user: true,
        orderProducts: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });
  }

  async verifyIfProductsExists(productIds: bigint[]) {
    return await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });
  }

  async createOrder(data: CreateOrderDto, totalAmount: number, userId: number) {
    return this.prisma.$transaction(async (prisma) => {
      // Create the order
      const order = await prisma.order.create({
        data: {
          totalAmount,
          statusId: StatusEnum.PENDING,
          userId,
          orderProducts: {
            create: data.orderProducts.map((item) => ({
              productId: BigInt(item.productId),
              quantity: item.quantity,
            })),
          },
        },
        include: {
          status: true,
          user: true,
          orderProducts: {
            include: {
              product: true,
            },
          },
        },
      });

      for (const item of data.orderProducts) {
        await prisma.product.update({
          where: { id: BigInt(item.productId) },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }
      return order;
    });
  }

  async orderStatusUpdate(orderId: bigint, statusId: number) {
    return await this.prisma.order.update({
      where: { id: orderId },
      data: { statusId },
      include: {
        status: true,
        user: true,
        orderProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findByOrderId(orderId: bigint, withStatus: boolean) {
    return await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { statusId: withStatus },
    });
  }
}
