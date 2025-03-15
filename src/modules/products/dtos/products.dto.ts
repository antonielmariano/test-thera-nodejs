export class CreateProductDto {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
}

export class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  categoryId?: number;
}
