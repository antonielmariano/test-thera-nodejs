import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dtos/users.dto';
import { hash } from 'bcryptjs';
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserRepository } from '../repositories/users.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    const { password, ...userData } = data;
    const hashedPassword = await hash(password, 10);

    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    let isAdmin = userData.isAdmin || false;

    const userCreated = await this.userRepository.createUser(userData, hashedPassword, isAdmin);

    return {
      id: userCreated.id,
      email: userCreated.email,
      name: userCreated.name,
      isAdmin: userCreated.isAdmin,
      createdAt: userCreated.createdAt,
    };
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    };
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<UserResponseDto> {
    try {
      const updateData: any = {...data};
      
      if (data.password) {
        updateData.password = await hash(data.password, 10);
      }

      const updatedUser = await this.userRepository.updateUser(id, updateData);

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Email already in use');
        }
      }
      throw error;
    }
  }
}
