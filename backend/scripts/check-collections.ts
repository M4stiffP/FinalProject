import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Size } from '../src/schemas/size.schema';

async function checkCollections() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const sizeModel = app.get<Model<Size>>(getModelToken('Size'));

  try {
    // Get database instance
    const db = sizeModel.db;
    
    // List all collections
    const collections = await db.listCollections();
    console.log('Collections in database:');
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });

    // Check size collection specifically
    const sizeCollection = collections.find(col => col.name === 'size');
    if (sizeCollection) {
      console.log('\n✅ Size collection found!');
      
      // Count documents in size collection
      const count = await sizeModel.countDocuments();
      console.log(`📊 Documents in size collection: ${count}`);
    } else {
      console.log('\n❌ Size collection not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await app.close();
  }
}

checkCollections();