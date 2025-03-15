export class CreateOrderDto {
  userId: number; //mudar para receber pelo token
  // é uma falha de segurança que deixa o usuario criar pedidos para outros usuarios
  orderProducts: {
    productId: string;
    quantity: number;
  }[];
}
