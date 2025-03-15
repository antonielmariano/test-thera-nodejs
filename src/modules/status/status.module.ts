import { Module } from '@nestjs/common';
import { StatusService } from './services/status.service';
import { StatusController } from './controllers/status.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StatusController],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
