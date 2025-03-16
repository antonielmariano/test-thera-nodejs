import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderProductDto {
  @ApiProperty({ example: '1', description: 'product Id' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 1, description: 'quantity products' })
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {

  @ApiProperty({ example: '[{productId: 1, quantity: 2}]', description: 'Array from products in order', isArray: true})
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  orderProducts: CreateOrderProductDto[];
}

export class ProductInOrderDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
}

export class OrderProductDto {
  id: string;
  productId: string;
  quantity: number;
  product: ProductInOrderDto;
}

export class StatusDto {
  id: number;
  name: string;
  description: string | null;
  isFinal: boolean;
  nextStatusId: number | null;
}

export class UserInOrderDto {
  id: number;
  name: string;
  email: string;
}

export class OrderResponseDto {
  id: string;
  totalAmount: number;
  statusId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  status: StatusDto;
  user: UserInOrderDto;
  orderProducts: OrderProductDto[];
}
