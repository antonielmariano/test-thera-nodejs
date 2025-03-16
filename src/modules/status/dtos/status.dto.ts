import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStatusDto {
  @ApiProperty({ example: '1', description: 'Status id' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Done', description: 'Status name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Done status', description: 'Status description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, description: 'Last status in flow' })
  @IsBoolean()
  isFinal: boolean;

  @ApiProperty({ example: 2, description: 'Next status to advance' })
  @IsOptional()
  @IsNumber()
  nextStatusId?: number;
}

export class UpdateStatusDto {
  @ApiPropertyOptional({ example: 'Canceled', description: 'Status name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Canceled Status', description: 'Status description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: false, description: 'Last status in flow' })
  @IsOptional()
  @IsBoolean()
  isFinal?: boolean;

  @ApiPropertyOptional({ example: 3, description: 'Next status to advance' })
  @IsOptional()
  @IsNumber()
  nextStatusId?: number;
}
