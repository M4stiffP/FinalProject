import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ collection: 'order' })
export class Order {
  @Prop({ required: true, unique: true })
  order_id: number;

  @Prop({ required: true })
  customer_id: number;

  @Prop({ required: true })
  order_date: Date;

  @Prop({ required: true })
  product_id: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unit_price: number;

  @Prop({ required: true })
  size: number;

  @Prop({ required: false, default: 1 })
  color_id: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);