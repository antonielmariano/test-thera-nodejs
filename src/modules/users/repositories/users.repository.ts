import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }
  
  async createUser(
    userData: any,
hashedPassword: string, isAdmin: boolean) {
    return await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        isAdmin: isAdmin || false,
      },
    });
  }

  async updateUser(id: number, updateData: any) {
    return await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }
}
