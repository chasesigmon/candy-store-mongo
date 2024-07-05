import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { PageOptionsDto } from '../../../validation/filters';
import {
  Customer,
  CustomerDTO,
  CustomerListResponse,
} from '../models/customer.entity';
import { CustomerRepository } from '../repositories/customer.repository';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(body: CustomerDTO): Promise<Customer> {
    return this.customerRepository.create(body);
  }

  async findAll(
    @Query() filter?: PageOptionsDto,
  ): Promise<CustomerListResponse> {
    const result = await this.customerRepository.findAll(filter);
    return {
      items: result[0],
      totalCount: result[1],
    };
  }

  async update(id: string, body: CustomerDTO): Promise<Customer> {
    await this.find(id);
    return this.customerRepository.update(parseInt(id), body);
  }

  async find(id: string): Promise<Customer> {
    const result = await this.customerRepository.find(parseInt(id));

    if (!result) {
      throw new NotFoundException(
        `Could not find Customer item with id: ${id}`,
      );
    }

    return result;
  }

  async seed() {
    const customers = await this.findAll();
    if (!customers.items.length) {
      await this.customerRepository.create({
        name: 'John',
      });
      await this.customerRepository.create({
        name: 'Fran',
      });
      await this.customerRepository.create({
        name: 'Sue',
      });
      await this.customerRepository.create({
        name: 'Jack',
      });
      await this.customerRepository.create({
        name: 'Sally',
      });
      await this.customerRepository.create({
        name: 'Sam',
      });
      await this.customerRepository.create({
        name: 'Mike',
      });
    }
  }
}
