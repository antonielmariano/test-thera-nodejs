import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 1, description: 'Category Id' })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Smartphones', description: 'Category name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Keyboards', description: 'Category name' })
  @IsOptional()
  @IsString()
  name?: string;
}
