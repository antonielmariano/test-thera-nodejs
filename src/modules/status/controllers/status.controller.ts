import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import { StatusService } from '../services/status.service';
import { CreateStatusDto, UpdateStatusDto } from '../dtos/status.dto';
import { StatusEnum } from '../enums/status.enum';
import { JwtAuthGuard } from 'src/common/utils/guard/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('statuses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @ApiOperation({ summary: 'List all status' })
  @ApiResponse({ status: 200, description: 'List all status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  getAllStatuses(@CurrentUser() user: any) {
    return this.statusService.getAllStatuses();
  }

  @ApiOperation({ summary: 'List flow status' })
  @ApiResponse({ status: 200, description: 'List flow status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('flow')
  getStatusFlow(@CurrentUser() user: any) {
    return this.statusService.getStatusFlow();
  }

  @ApiOperation({ summary: 'Update Status' })
  @ApiParam({ name: 'id', required: true, description: 'Status Id' })
  @ApiResponse({ status: 200, description: 'Status info' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id')
  getStatusById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.statusService.getStatusById(id);
  }

  @ApiOperation({ summary: 'Search status by type' })
  @ApiParam({ name: 'type', required: true, description: 'type for search status' })
  @ApiResponse({ status: 200, description: 'Category updated' })
  @ApiResponse({ status: 400, description: 'Invalid status type' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('enum/:type')
  getStatusByEnum(@Param('type') type: keyof typeof StatusEnum, @CurrentUser() user: any) {
    if (!(type in StatusEnum)) {
      throw new BadRequestException(`Invalid status type: ${type}`);
    }

    const statusId = StatusEnum[type];
    return this.statusService.getStatusById(statusId as number);
  }

  @ApiOperation({ summary: 'Create status' })
  @ApiBody({ type: CreateStatusDto })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiResponse({ status: 403, description: 'User without permission Admin' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  createStatus(@Body() createStatusDto: CreateStatusDto, @CurrentUser() user: any) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Only administrators can create status');
    }
    return this.statusService.createStatus(createStatusDto);
  }

  @ApiOperation({ summary: 'Update status' })
  @ApiParam({ name: 'id', required: true, description: 'status Id' })
  @ApiBody({ type: UpdateStatusDto })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiResponse({ status: 403, description: 'User without permission Admin' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Put(':id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
    @CurrentUser() user: any
  ) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Only administrators can update status');
    }
    return this.statusService.updateStatus(id, updateStatusDto);
  }

  @ApiOperation({ summary: 'Delete status' })
  @ApiParam({ name: 'id', required: true, description: 'status Id' })
  @ApiResponse({ status: 200, description: 'Status deleted' })
  @ApiResponse({ status: 403, description: 'User without permission Admin' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete(':id')
  deleteStatus(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Only administrators can delete status');
    }
    return this.statusService.deleteStatus(id);
  }
}