import { Module } from '@nestjs/common';
import { StatusService } from './services/status.service';
import { StatusController } from './controllers/status.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { StatusRepository } from './repositories/status.repository';

@Module({
  imports: [PrismaModule],
  controllers: [StatusController],
  providers: [StatusService, StatusRepository],
  exports: [StatusService],
})
export class StatusModule {}
