import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  getMyOrders(@Request() req) {
    return this.ordersService.findByCustomer(req.user.id_Customer);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createOrderDto: any, @Request() req) {
    return this.ordersService.create({
      ...createOrderDto,
      customer_id: req.user.id_Customer,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateOrderDto: any) {
    return this.ordersService.update(Number(id), updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(Number(id));
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async checkout(@Body() checkoutData: { cartItems: any[] }, @Request() req) {
    try {
      const result = await this.ordersService.processCheckout(
        req.user.id_Customer,
        checkoutData.cartItems
      );
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}