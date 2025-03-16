import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'teste@email.com', description: 'User email' })
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @ApiProperty({ example: 'pw123', description: 'User password' })
  password: string;
}
