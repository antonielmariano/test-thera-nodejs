import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
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
