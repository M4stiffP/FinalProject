import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from '../src/schemas/customer.schema';
import { Product } from '../src/schemas/product.schema';
import { Color } from '../src/schemas/color.schema';
import { Order } from '../src/schemas/order.schema';
import { Size } from '../src/schemas/size.schema';

async function clearDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const customerModel = app.get<Model<Customer>>(getModelToken('Customer'));
  const productModel = app.get<Model<Product>>(getModelToken('Product'));
  const colorModel = app.get<Model<Color>>(getModelToken('Color'));
  const orderModel = app.get<Model<Order>>(getModelToken('Order'));
  const sizeModel = app.get<Model<Size>>(getModelToken('Size'));

  try {
    console.log('Dropping all collections...');
    
    // Get database instance
    const db = customerModel.db;
    
    // List all collections and drop them
    const collections = await db.listCollections();
    for (const collection of collections) {
      try {
        await db.collection(collection.name).drop();
        console.log(`Dropped collection: ${collection.name}`);
      } catch (e) {
        console.log(`Collection ${collection.name} not found or already dropped`);
      }
    }

    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await app.close();
  }
}

clearDatabase();