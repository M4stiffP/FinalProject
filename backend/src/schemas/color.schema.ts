import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ColorDocument = Color & Document;

@Schema({ collection: 'colors' })
export class Color {
  @Prop({ required: true, unique: true })
  color_id: number;

  @Prop({ required: true })
  color_name: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  colortag: string;

  @Prop({ required: true })
  product_id: number;
}

export const ColorSchema = SchemaFactory.createForClass(Color);