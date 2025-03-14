import { Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAllProducts() {
    return this.ordersService.getAllOrders();
  }

  @Post()
  createProduct() {
    return this.ordersService.createOrder();
  }
}
