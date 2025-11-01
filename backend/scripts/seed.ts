import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Customer } from '../src/schemas/customer.schema';
import { Product } from '../src/schemas/product.schema';
import { Color } from '../src/schemas/color.schema';
import { Order } from '../src/schemas/order.schema';
import { Size } from '../src/schemas/size.schema';
import * as bcrypt from 'bcryptjs';

// Import JSON data
const customerData = require('../data/customer.json');
const productData = require('../data/product.json');
const colorData = require('../data/color.json');
const orderData = require('../data/order.json');
const sizeData = require('../data/size.json');

// Helper function to convert MongoDB ObjectId format
function convertObjectId(obj: any): any {
  if (obj && typeof obj === 'object') {
    if (obj.$oid) {
      return new Types.ObjectId(obj.$oid);
    }
    if (Array.isArray(obj)) {
      return obj.map(convertObjectId);
    }
    const converted: any = {};
    for (const key in obj) {
      if (key === '_id' && obj[key].$oid) {
        // Don't include _id, let MongoDB generate new ones
        continue;
      }
      if (key === 'size_id') {
        // Skip size_id field - we don't need it anymore
        continue;
      }
      converted[key] = convertObjectId(obj[key]);
    }
    return converted;
  }
  return obj;
}

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const customerModel = app.get<Model<Customer>>(getModelToken('Customer'));
  const productModel = app.get<Model<Product>>(getModelToken('Product'));
  const colorModel = app.get<Model<Color>>(getModelToken('Color'));
  const orderModel = app.get<Model<Order>>(getModelToken('Order'));
  const sizeModel = app.get<Model<Size>>(getModelToken('Size'));

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await customerModel.deleteMany({});
    await productModel.deleteMany({});
    await colorModel.deleteMany({});
    await orderModel.deleteMany({});
    await sizeModel.deleteMany({});

    // Seed customers (hash passwords)
    console.log('Seeding customers...');
    const customersWithHashedPasswords = await Promise.all(
      customerData.map(async (customer: any) => {
        const convertedCustomer = convertObjectId(customer);
        return {
          ...convertedCustomer,
          password: await bcrypt.hash(convertedCustomer.password, 10)
        };
      })
    );
    await customerModel.insertMany(customersWithHashedPasswords);

    // Seed products
    console.log('Seeding products...');
    const convertedProducts = productData.map(convertObjectId);
    await productModel.insertMany(convertedProducts);

    // Seed colors
    console.log('Seeding colors...');
    const convertedColors = colorData.map(convertObjectId);
    await colorModel.insertMany(convertedColors);

    // Seed sizes
    console.log('Seeding sizes...');
    const convertedSizes = sizeData.map(convertObjectId);
    await sizeModel.insertMany(convertedSizes);

    // Seed orders
    console.log('Seeding orders...');
    const ordersWithParsedDates = orderData.map((order: any) => {
      const convertedOrder = convertObjectId(order);
      return {
        ...convertedOrder,
        order_date: convertedOrder.order_date.$date ? new Date(convertedOrder.order_date.$date) : new Date(convertedOrder.order_date)
      };
    });
    await orderModel.insertMany(ordersWithParsedDates);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await app.close();
  }
}

seed();