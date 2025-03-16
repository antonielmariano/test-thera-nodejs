import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dtos/auth.dto';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/modules/users/repositories/users.repository';

@Injectable()
export class AuthService {

  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findByEmail(email);

    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);

    const payload = {
      email: user.email,
      sub: user.id,
      isAdmin: user.isAdmin || false,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin || false,
      },
    };
  }
}
