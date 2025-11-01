import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Customer, CustomerDocument } from '../schemas/customer.schema';
import { CreateCustomerDto, LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createCustomerDto: CreateCustomerDto) {
    const { name, email, phone, password } = createCustomerDto;

    // Check if email already exists
    const existingCustomer = await this.customerModel.findOne({ email });
    if (existingCustomer) {
      throw new ConflictException('Email already exists');
    }

    // Get the next id_Customer
    const lastCustomer = await this.customerModel.findOne().sort({ id_Customer: -1 });
    const nextId = lastCustomer ? lastCustomer.id_Customer + 1 : 1;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer
    const customer = new this.customerModel({
      id_Customer: nextId,
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await customer.save();

    // Generate JWT token
    const payload = { email: customer.email, sub: customer.id_Customer };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Customer registered successfully',
      token,
      customer: {
        id_Customer: customer.id_Customer,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find customer
    const customer = await this.customerModel.findOne({ email });
    if (!customer) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const payload = { email: customer.email, sub: customer.id_Customer };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      token,
      customer: {
        id_Customer: customer.id_Customer,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    };
  }

  async validateUser(payload: any) {
    const customer = await this.customerModel.findOne({ id_Customer: payload.sub });
    if (!customer) {
      throw new UnauthorizedException();
    }
    return customer;
  }
}