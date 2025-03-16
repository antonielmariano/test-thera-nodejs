import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'teste@gmail.com', description: 'User email' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123', description: 'User password' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Alvarez', description: 'User name' })
  @IsString()
  name: string;

  @ApiProperty({ example: true, description: 'Is user admin' })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Juan', description: 'Update user name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'teste2@gmail.com', description: 'Update user email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '123', description: 'User password' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ example: false, description: 'Is admin user' })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}

export class UserResponseDto {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: Date;
}
