import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Model, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Size } from '../src/schemas/size.schema';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to convert MongoDB ObjectId format and remove size_id and product_id
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
      if (key === 'size_id' || key === 'product_id') {
        // Skip size_id and product_id fields - we don't need them anymore
        continue;
      }
      converted[key] = convertObjectId(obj[key]);
    }
    return converted;
  }
  return obj;
}

async function importSize() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const sizeModel = app.get<Model<Size>>(getModelToken('Size'));

  try {
    // ตรวจสอบไฟล์ที่จะ import (คุณสามารถเปลี่ยน path ได้)
    const filePath = path.join(process.cwd(), 'data', 'FinalDB.size.json');
    
    console.log(`Checking file: ${filePath}`);
    
    let sizeData: any[];
    
    if (fs.existsSync(filePath)) {
      console.log('Reading FinalDB.size.json...');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      sizeData = JSON.parse(fileContent);
    } else {
      console.log('FinalDB.size.json not found, using default size.json...');
      const defaultFilePath = path.join(process.cwd(), 'data', 'size.json');
      const fileContent = fs.readFileSync(defaultFilePath, 'utf8');
      sizeData = JSON.parse(fileContent);
    }

    console.log(`Found ${sizeData.length} size records to import`);

    // ล้างข้อมูล size เก่า
    console.log('Clearing existing size data...');
    await sizeModel.deleteMany({});

    // แปลงข้อมูลและ import (ลบ size_id ออก)
    console.log('Converting and importing size data...');
    const convertedSizes = sizeData.map(convertObjectId);
    
    // ตรวจสอบโครงสร้างข้อมูล
    console.log('Sample data structure:', JSON.stringify(convertedSizes[0], null, 2));

    await sizeModel.insertMany(convertedSizes);

    console.log(`Successfully imported ${convertedSizes.length} size records!`);
    
    // ตรวจสอบผลลัพธ์
    const count = await sizeModel.countDocuments();
    console.log(`Total size records in database: ${count}`);

    // แสดงข้อมูลตัวอย่าง
    const samples = await sizeModel.find().limit(3);
    console.log('\nSample records:');
    samples.forEach((record, index) => {
      console.log(`${index + 1}. _id: ${record._id}, color_id: ${record.color_id}, size: ${record.size}, stock: ${record.stock_in - record.stock_out}`);
    });

  } catch (error) {
    console.error('Error importing size data:', error);
    
    if (error.code === 11000) {
      console.error('Duplicate key error - some records may already exist');
      console.error('Try clearing the database first with: npm run clear-db');
    }
  } finally {
    await app.close();
  }
}

importSize();