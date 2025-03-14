import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  getAllOrders() {
    return 'Lista de pedidos';
  }

  createOrder() {
    return 'Pedido criado com sucesso';
  }
}
