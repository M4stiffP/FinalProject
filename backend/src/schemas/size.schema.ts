import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SizeDocument = Size & Document;

@Schema({ collection: 'size' })
export class Size {
  @Prop({ required: true })
  color_id: number;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  stock_in: number;

  @Prop({ required: true })
  stock_out: number;
}

export const SizeSchema = SchemaFactory.createForClass(Size);