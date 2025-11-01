import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from '../schemas/customer.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async findAll() {
    return this.customerModel.find().select('-password').exec();
  }

  async findOne(id: number) {
    return this.customerModel.findOne({ id_Customer: id }).select('-password').exec();
  }

  async findByEmail(email: string) {
    return this.customerModel.findOne({ email }).exec();
  }

  async update(id: number, updateData: any) {
    return this.customerModel
      .findOneAndUpdate({ id_Customer: id }, updateData, { new: true })
      .select('-password')
      .exec();
  }

  async remove(id: number) {
    return this.customerModel.findOneAndDelete({ id_Customer: id }).exec();
  }
}