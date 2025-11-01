import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Color, ColorDocument } from '../schemas/color.schema';
import { Size, SizeDocument } from '../schemas/size.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Color.name) private colorModel: Model<ColorDocument>,
    @InjectModel(Size.name) private sizeModel: Model<SizeDocument>,
  ) {}

  async findAll() {
    return this.productModel.find().exec();
  }

  async findOne(id: number) {
    return this.productModel.findOne({ product_id: id }).exec();
  }

  async getProductColors(productId: number) {
    return this.colorModel.find({ product_id: productId }).exec();
  }

  async getProductSizes(productId: number, colorId?: number) {
    // Since size is now only connected to color_id, we need to get colors first
    const colors = await this.getProductColors(productId);
    const colorIds = colors.map(color => color.color_id);
    
    const query: any = { 
      color_id: { $in: colorIds },
      stock_in: { $gt: 0 } // Only show sizes with stock > 0
    };
    if (colorId) {
      query.color_id = colorId;
    }
    return this.sizeModel.find(query).exec();
  }

  async getProductDetails(productId: number) {
    const product = await this.findOne(productId);
    if (!product) {
      return null;
    }

    const colors = await this.getProductColors(productId);
    const sizes = await this.getProductSizes(productId);

    return {
      ...product.toObject(),
      colors,
      sizes,
    };
  }

  async searchProducts(query: string) {
    const searchRegex = new RegExp(query, 'i');
    return this.productModel
      .find({
        $or: [
          { brand: searchRegex },
          { model: searchRegex },
          { description: searchRegex },
        ],
      })
      .exec();
  }

  async getProductsByBrand(brand: string) {
    return this.productModel.find({ brand: new RegExp(brand, 'i') }).exec();
  }

  async getProductsByPriceRange(minPrice: number, maxPrice: number) {
    return this.productModel
      .find({
        price: { $gte: minPrice, $lte: maxPrice },
      })
      .exec();
  }

  async updateStock(colorId: number, size: number, quantity: number) {
    const sizeRecord = await this.sizeModel.findOne({ 
      color_id: colorId, 
      size: size 
    });
    
    if (!sizeRecord) {
      throw new Error('Size record not found');
    }
    
    if (sizeRecord.stock_in < quantity) {
      throw new Error('Insufficient stock');
    }
    
    // Reduce stock_in and increase stock_out
    await this.sizeModel.updateOne(
      { color_id: colorId, size: size },
      { 
        $inc: { 
          stock_in: -quantity,
          stock_out: quantity 
        } 
      }
    );
    
    return true;
  }

  async findSizeRecord(colorId: number, size: number) {
    return this.sizeModel.findOne({ color_id: colorId, size: size }).exec();
  }
}