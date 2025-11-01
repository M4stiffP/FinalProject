import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Size } from '../src/schemas/size.schema';

async function diagnoseSize() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const sizeModel = app.get<Model<Size>>(getModelToken('Size'));

  try {
    console.log('🔍 Diagnosing Size Collection Issues...\n');

    // 1. ตรวจสอบจำนวนข้อมูลทั้งหมด
    const totalCount = await sizeModel.countDocuments();
    console.log(`📊 Total size records: ${totalCount}`);

    // 2. ตรวจสอบข้อมูลตัวอย่าง
    const sampleData = await sizeModel.find().limit(3);
    console.log('\n📝 Sample size data:');
    sampleData.forEach((size, index) => {
      console.log(`   ${index + 1}. _id: ${size._id}, color_id: ${size.color_id}, size: ${size.size}, stock_in: ${size.stock_in}, stock_out: ${size.stock_out}`);
    });

    // 3. ตรวจสอบ schema validation (เฉพาะ color_id เชื่อมต่อ)
    console.log('\n🔧 Schema Validation:');
    console.log('   Required fields: color_id, size, stock_in, stock_out');
    
    const missingData = await sizeModel.find({
      $or: [
        { color_id: { $exists: false } },
        { size: { $exists: false } },
        { stock_in: { $exists: false } },
        { stock_out: { $exists: false } }
      ]
    });

    if (missingData.length > 0) {
      console.log(`   ❌ Found ${missingData.length} records with missing required fields`);
    } else {
      console.log('   ✅ All records have required fields');
    }

    // 4. ตรวจสอบ data types
    const invalidTypes = await sizeModel.find({
      $or: [
        { color_id: { $not: { $type: 'number' } } },
        { size: { $not: { $type: 'number' } } },
        { stock_in: { $not: { $type: 'number' } } },
        { stock_out: { $not: { $type: 'number' } } }
      ]
    });

    if (invalidTypes.length > 0) {
      console.log(`   ❌ Found ${invalidTypes.length} records with invalid data types`);
    } else {
      console.log('   ✅ All records have correct data types');
    }

    // 5. ตรวจสอบการซ้ำกันของ combination (color_id + size)
    const duplicateCombinations = await sizeModel.aggregate([
      { 
        $group: { 
          _id: { color_id: '$color_id', size: '$size' }, 
          count: { $sum: 1 } 
        } 
      },
      { $match: { count: { $gt: 1 } } }
    ]);
    
    if (duplicateCombinations.length > 0) {
      console.log('\n❌ Duplicate combinations found:');
      duplicateCombinations.forEach(dup => {
        console.log(`   color_id: ${dup._id.color_id}, size: ${dup._id.size} appears ${dup.count} times`);
      });
    } else {
      console.log('\n✅ No duplicate combinations found');
    }

    console.log('\n🎯 Recommendations:');
    
    if (duplicateCombinations.length > 0) {
      console.log('   1. Clear database and re-import with unique combinations');
      console.log('   2. Use: npm run clear-db && npm run import-size');
    }
    
    if (totalCount === 0) {
      console.log('   1. Import size data using: npm run import-size');
      console.log('   2. Make sure your JSON file exists in data/ folder');
    }

    if (totalCount > 0 && duplicateCombinations.length === 0 && missingData.length === 0 && invalidTypes.length === 0) {
      console.log('   ✅ Size collection looks healthy!');
    }

  } catch (error) {
    console.error('❌ Error diagnosing size collection:', error);
  } finally {
    await app.close();
  }
}

diagnoseSize();