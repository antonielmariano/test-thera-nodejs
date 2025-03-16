import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto, OrderResponseDto } from '../dtos/orders.dto';
import { JwtAuthGuard } from 'src/common/utils/guard/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'List All orders' })
  @ApiResponse({ status: 200, description: ' List All orders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  getAllOrders(@CurrentUser() user: any) {
    if (user.isAdmin) {
      return this.ordersService.getAllOrders();
    }

    return this.ordersService.getOrdersByUser(user.id);
  }

  @ApiOperation({ summary: 'List orders by user' })
  @ApiResponse({ status: 200, description: 'List Orders by user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('my')
  getMyOrders(@CurrentUser() user: any) {
    return this.ordersService.getOrdersByUser(user.id);
  }

  @ApiOperation({ summary: 'Get order by id' })
  @ApiParam({ name: 'id', required: true, description: 'Order Id' })
  @ApiResponse({ status: 200, description: 'Order info' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Get(':id')
  async getOrderById(@Param('id') id: string, @CurrentUser() user: any): Promise<OrderResponseDto> {
    const order = await this.ordersService.getOrderById(id);

    if (order.userId !== user.id && !user.isAdmin) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  @ApiOperation({ summary: 'Create order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 200, description: 'Order created' })
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: any) {
    if (!createOrderDto.orderProducts || createOrderDto.orderProducts.length === 0) {
      throw new BadRequestException('Order must contain at least one product');
    }
    
    return this.ordersService.createOrder(createOrderDto, user.id);
  }

  @ApiOperation({ summary: 'Advance status order' })
  @ApiParam({ name: 'id', required: true, description: 'Order Id' })
  @ApiResponse({ status: 200, description: 'Order advanced to next status' })
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Patch(':id/advance-status')
  async advanceOrderStatus(@Param('id') id: string, @CurrentUser() user: any) {
    const order = await this.ordersService.getOrderById(id);
    
    if (order.userId !== user.id && !user.isAdmin) {
      throw new NotFoundException('Order not found');
    }
    
    return this.ordersService.advanceOrderStatus(id);
  }
}