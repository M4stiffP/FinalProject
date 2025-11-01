import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    if (search) {
      return this.productsService.searchProducts(search);
    }
    if (brand) {
      return this.productsService.getProductsByBrand(brand);
    }
    if (minPrice && maxPrice) {
      return this.productsService.getProductsByPriceRange(
        Number(minPrice),
        Number(maxPrice),
      );
    }
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.getProductDetails(Number(id));
  }

  @Get(':id/colors')
  async getColors(@Param('id') id: string) {
    return this.productsService.getProductColors(Number(id));
  }

  @Get(':id/sizes')
  async getSizes(
    @Param('id') id: string,
    @Query('colorId') colorId?: string,
  ) {
    return this.productsService.getProductSizes(
      Number(id),
      colorId ? Number(colorId) : undefined,
    );
  }
}