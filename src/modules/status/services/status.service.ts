import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateStatusDto, UpdateStatusDto } from '../dto/status.dto';

@Injectable()
export class StatusService {
  constructor(private prisma: PrismaService) {}

  async getAllStatuses() {
    return this.prisma.status.findMany({
      include: {
        nextStatus: true
      }
    });
  }

  async getStatusById(id: number) {
    return this.prisma.status.findUnique({
      where: { id },
      include: {
        nextStatus: true,
        previousStatus: true
      }
    });
  }

  async createStatus(data: CreateStatusDto) {
    return this.prisma.status.create({
      data,
      include: {
        nextStatus: true
      }
    });
  }

  async updateStatus(id: number, data: UpdateStatusDto) {
    return this.prisma.status.update({
      where: { id },
      data,
      include: {
        nextStatus: true
      }
    });
  }

  async deleteStatus(id: number) {
    return this.prisma.status.delete({
      where: { id }
    });
  }

  async getStatusFlow() {
    const statuses = await this.prisma.status.findMany({
      include: {
        nextStatus: true,
        previousStatus: true
      }
    });
    
    const initialStatus = statuses.find(status => status.previousStatus.length === 0);
    
    if (!initialStatus) {
      return [];
    }
    
    const flow = [initialStatus];
    let currentStatus = initialStatus;
    
    while (currentStatus.nextStatusId) {
      const nextStatus = statuses.find(s => s.id === currentStatus.nextStatusId);
      if (!nextStatus) break;
      
      flow.push(nextStatus);
      currentStatus = nextStatus;
    }
    
    return flow;
  }
}