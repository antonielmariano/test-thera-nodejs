import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { StatusService } from '../services/status.service';
import { CreateStatusDto, UpdateStatusDto } from '../dto/status.dto';

@Controller('statuses')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  getAllStatuses() {
    return this.statusService.getAllStatuses();
  }

  @Get('flow')
  getStatusFlow() {
    return this.statusService.getStatusFlow();
  }

  @Get(':id')
  getStatusById(@Param('id', ParseIntPipe) id: number) {
    return this.statusService.getStatusById(id);
  }

  @Post()
  createStatus(@Body() createStatusDto: CreateStatusDto) {
    return this.statusService.createStatus(createStatusDto);
  }

  @Put(':id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.statusService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  deleteStatus(@Param('id', ParseIntPipe) id: number) {
    return this.statusService.deleteStatus(id);
  }
}
