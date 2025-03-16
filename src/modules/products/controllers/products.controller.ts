import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  ForbiddenException
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto, UpdateProductDto } from '../dtos/products.dto';
import { JwtAuthGuard } from 'src/common/utils/guard/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'List all products' })
  @ApiResponse({ status: 200, description: 'List all products' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  getAllProducts(@CurrentUser() user: any) {
    return this.productsService.getAllProducts();
  }

  @ApiOperation({ summary: 'Search product by term' })
  @ApiParam({ name: 'term', required: true, description: 'name to search a product' })
  @ApiResponse({ status: 200, description: 'List All products by term' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('search')
  searchProducts(@Query('term') searchTerm: string, @CurrentUser() user: any) {
    return this.productsService.searchProducts(searchTerm);
  }

  @ApiOperation({ summary: 'Get products by category' })
  @ApiParam({ name: 'categoryId', required: true, description: 'Category Id' })
  @ApiResponse({ status: 200, description: 'List All produts by category' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('category/:categoryId')
  getProductsByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @CurrentUser() user: any
  ) {
    return this.productsService.getProductsByCategory(categoryId);
  }

  @ApiOperation({ summary: 'Get products by Id' })
  @ApiParam({ name: 'id', required: true, description: 'Product Id' })
  @ApiResponse({ status: 200, description: 'Product info' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id')
  getProductById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.getProductById(id);
  }

  @ApiOperation({ summary: 'Create product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 200, description: 'Product created' })
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiResponse({ status: 403, description: 'User without permission Admin' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto, @CurrentUser() user: any) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Only administrators can create products');
    }
    return this.productsService.createProduct(createProductDto);
  }

  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id', required: true, description: 'Product id' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiResponse({ status: 403, description: 'User without permission Admin' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: any
  ) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Only administrators can update products');
    }
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete product' })
  @ApiParam({ name: 'id', required: true, description: 'Product id' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  @ApiResponse({ status: 403, description: 'User without permission Admin' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete(':id')
  deleteProduct(@Param('id') id: string, @CurrentUser() user: any) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Only administrators can delete products');
    }
    return this.productsService.deleteProduct(id);
  }
}