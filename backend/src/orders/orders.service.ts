import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { ProductsService } from '../products/products.service';

interface CartItem {
  product_id: number;
  color_id: number;
  size: number;
  quantity: number;
  price: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService,
  ) {}

  async findAll() {
    return this.orderModel.find().exec();
  }

  async findByCustomer(customerId: number) {
    return this.orderModel.find({ customer_id: customerId }).exec();
  }

  async findOne(id: number) {
    return this.orderModel.findOne({ order_id: id }).exec();
  }

  async create(orderData: any) {
    const lastOrder = await this.orderModel.findOne().sort({ order_id: -1 });
    const nextId = lastOrder ? lastOrder.order_id + 1 : 1;

    const order = new this.orderModel({
      order_id: nextId,
      ...orderData,
      order_date: new Date(),
    });

    return order.save();
  }

  async update(id: number, updateData: any) {
    return this.orderModel
      .findOneAndUpdate({ order_id: id }, updateData, { new: true })
      .exec();
  }

  async remove(id: number) {
    return this.orderModel.findOneAndDelete({ order_id: id }).exec();
  }

  async processCheckout(customerId: number, cartItems: CartItem[]) {
    try {
      // 1. Validate stock for all items
      for (const item of cartItems) {
        const sizeRecord = await this.productsService.findSizeRecord(item.color_id, item.size);
        if (!sizeRecord || sizeRecord.stock_in < item.quantity) {
          throw new Error(`Insufficient stock for size ${item.size}`);
        }
      }

      // 2. Create order records for each item
      const orderPromises = cartItems.map(async (item) => {
        const lastOrder = await this.orderModel.findOne().sort({ order_id: -1 });
        const nextId = lastOrder ? lastOrder.order_id + 1 : 1;

        const order = new this.orderModel({
          order_id: nextId,
          customer_id: customerId,
          product_id: item.product_id,
          color_id: item.color_id,
          size: item.size,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
          order_date: new Date(),
        });

        return order.save();
      });

      // 3. Update stock for all items
      const stockPromises = cartItems.map(item =>
        this.productsService.updateStock(item.color_id, item.size, item.quantity)
      );

      // 4. Execute all operations
      await Promise.all([...orderPromises, ...stockPromises]);

      return { success: true, message: 'Order processed successfully' };
    } catch (error) {
      throw new Error(`Checkout failed: ${error.message}`);
    }
  }
}