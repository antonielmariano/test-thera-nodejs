import { Module } from '@nestjs/common';
import { UserService } from './services/users.service';
import { UserController } from './controllers/users.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/common/utils/guard/jwt-auth.guard';
import { UserRepository } from './repositories/users.repository';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard, UserRepository],
})
export class UserModule {}
