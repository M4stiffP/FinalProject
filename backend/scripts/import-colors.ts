import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Model, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Color } from '../src/schemas/color.schema';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to convert MongoDB ObjectId format and clean data
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
      // Fix colortag - add # if missing
      if (key === 'colortag' && obj[key] && !obj[key].startsWith('#')) {
        converted[key] = '#' + obj[key];
      } else {
        converted[key] = convertObjectId(obj[key]);
      }
    }
    return converted;
  }
  return obj;
}

async function importColors() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const colorModel = app.get<Model<Color>>(getModelToken('Color'));

  try {
    // ตรวจสอบไฟล์ที่จะ import
    const filePath = path.join(process.cwd(), 'data', 'FinalDB.color.json');
    
    console.log(`Checking file: ${filePath}`);
    
    let colorData: any[];
    
    if (fs.existsSync(filePath)) {
      console.log('Reading FinalDB.color.json...');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      colorData = JSON.parse(fileContent);
    } else {
      console.log('FinalDB.color.json not found, using default color.json...');
      const defaultFilePath = path.join(process.cwd(), 'data', 'color.json');
      const fileContent = fs.readFileSync(defaultFilePath, 'utf8');
      colorData = JSON.parse(fileContent);
    }

    console.log(`Found ${colorData.length} color records to import`);

    // ล้างข้อมูล colors เก่า
    console.log('Clearing existing color data...');
    await colorModel.deleteMany({});

    // แปลงข้อมูลและ import
    console.log('Converting and importing color data...');
    const convertedColors = colorData.map(convertObjectId);
    
    // ตรวจสอบโครงสร้างข้อมูล
    console.log('Sample data structure:', JSON.stringify(convertedColors[0], null, 2));

    await colorModel.insertMany(convertedColors);

    console.log(`Successfully imported ${convertedColors.length} color records!`);
    
    // ตรวจสอบผลลัพธ์
    const count = await colorModel.countDocuments();
    console.log(`Total color records in database: ${count}`);

    // แสดงข้อมูลตัวอย่าง
    const samples = await colorModel.find().limit(3);
    console.log('\nSample records:');
    samples.forEach((record, index) => {
      console.log(`${index + 1}. _id: ${record._id}, color_id: ${record.color_id}, color_name: ${record.color_name}, product_id: ${record.product_id}, colortag: ${record.colortag}`);
    });

  } catch (error) {
    console.error('Error importing color data:', error);
    
    if (error.code === 11000) {
      console.error('Duplicate key error - some records may already exist');
      console.error('Try clearing the database first with: npm run clear-db');
    }
  } finally {
    await app.close();
  }
}

importColors();