import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  getAllProducts() {
    return 'Lista de produtos';
  }

  createProduct() {
    return 'Produto criado com sucesso';
  }
}
