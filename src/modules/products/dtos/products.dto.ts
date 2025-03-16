import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Smartphone 11', description: 'Product name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Smartphone 11 8gb', description: 'Product description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 14, description: 'Product price' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 14, description: 'Product stock quantity' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({ example: 1, description: 'Category Id' })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Smartphone', description: 'Product name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Smartphone 11 6GB', description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1400, description: 'Product unit price' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({ example: 4, description: 'Product stock quantity' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @ApiPropertyOptional({ example: 1, description: 'category id' })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
