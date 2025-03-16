import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateStatusDto, UpdateStatusDto } from '../dtos/status.dto';

@Injectable()
export class StatusRepository {
  constructor(private readonly prisma: PrismaService) { }

  async getNextStatusId(currentStatusId: number, withNextStatus: boolean) {
    return await this.prisma.status.findUnique({
      where: { id: currentStatusId },
      select: { nextStatusId: withNextStatus },
    });
  }

  async getAllStatus(
    includeNextStatus: boolean,
    includePreviousStatus: boolean
  ) {
    return await this.prisma.status.findMany({
      include: {
        nextStatus: includeNextStatus,
        previousStatus: includePreviousStatus
      },
    });
  }

  async findStatusById(
    id: number,
    includeNextStatus: boolean,
    includePreviousStatus: boolean,
  ) {
    return await this.prisma.status.findUnique({
      where: { id },
      include: {
        nextStatus: includeNextStatus,
        previousStatus: includePreviousStatus,
      },
    });
  }

  async createStatus(data: CreateStatusDto) {
    return await this.prisma.status.create({
      data: {
        name: data.name,
        description: data.description,
        isFinal: data.isFinal,
        nextStatusId: data.nextStatusId,
      },
      include: {
        nextStatus: true,
      },
    });
  }
  async updateStatus(id: number, data: UpdateStatusDto) {
    return await this.prisma.status.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        description: data.description ?? undefined,
        isFinal: data.isFinal ?? undefined,
        nextStatusId: data.nextStatusId ?? undefined,
      },
      include: {
        nextStatus: true,
      },
    });
  }

  async deleteStatus(id: number) {
    return await this.prisma.status.delete({
      where: { id },
    });
  }
}
