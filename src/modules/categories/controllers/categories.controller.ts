import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/categories.dto';
import { CategoriesEnum } from '../enums/categories.enum';
import { JwtAuthGuard } from 'src/common/utils/guard/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dtos/users.dto';

@Controller('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'List All categories' })
  @ApiResponse({ status: 200, description: 'List All categories' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  getAllCategories(@CurrentUser() user: any) {
    return this.categoriesService.getAllCategories();
  }

  @ApiOperation({ summary: 'List category by id' })
  @ApiResponse({ status: 200, description: 'Category info' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id')
  getCategoryById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.categoriesService.getCategoryById(id);
  }

  @ApiOperation({ summary: 'List categories by type' })
  @ApiResponse({ status: 200, description: 'All categories by type' })
  @ApiResponse({ status: 400, description: 'Invalid category type' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('enum/:type')
  getCategoryByEnum(@Param('type') type: keyof typeof CategoriesEnum, @CurrentUser() user: any) {
    if (!(type in CategoriesEnum)) {
      throw new BadRequestException(`Invalid category type: ${type}`);
    }

    const categoryId = CategoriesEnum[type];
    return this.categoriesService.getCategoryById(categoryId as number);
  }

  @ApiOperation({ summary: 'Create category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 200, description: 'Category created' })
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiResponse({ status: 403, description: 'User without permission Admin' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() user: any) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Only administrators can create categories');
    }
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @ApiOperation({ summary: 'Update category' })
  @ApiParam({ name: 'id', required: true, description: 'Category Id' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Category updated' })
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiResponse({ status: 403, description: 'User without permission Admin' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Patch(':id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() user: any
  ) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Only administrators can update categories');
    }
    return this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete category' })
  @ApiParam({ name: 'id', required: true, description: 'Category Id' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiResponse({ status: 403, description: 'User without permission Admin' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete(':id')
  deleteCategory(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Only administrators can delete categories');
    }
    return this.categoriesService.deleteCategory(id);
  }
}