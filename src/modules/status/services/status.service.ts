import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStatusDto, UpdateStatusDto } from '../dtos/status.dto';
import { StatusRepository } from '../repositories/status.repository';

@Injectable()
export class StatusService {
  constructor(private statusRepository: StatusRepository) {}

  async getAllStatuses() {
    return this.statusRepository.getAllStatus(true, false);
  }

  async getStatusById(id: number) {
    const status = await this.statusRepository.findStatusById(id, true, true);

    if (!status) {
      throw new NotFoundException(`Status with ID ${id} not found`);
    }

    return status;
  }

  async createStatus(data: CreateStatusDto) {
    try {
      return await this.statusRepository.createStatus(data);
    } catch (error) {
      throw new Error(`Failed to create status: ${error.message}`);
    }
  }

  async updateStatus(id: number, data: UpdateStatusDto) {
    try {
      return await this.statusRepository.updateStatus(id, data);
    } catch (error) {
      throw new NotFoundException(`Status with ID ${id} not found`);
    }
  }

  async deleteStatus(id: number) {
    try {
      return await this.statusRepository.deleteStatus(id);
    } catch (error) {
      throw new NotFoundException(`Status with ID ${id} not found`);
    }
  }

  async getStatusFlow() {
    const statuses = await this.statusRepository.getAllStatus(true, true);

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
