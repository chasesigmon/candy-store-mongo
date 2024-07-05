import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  checkNameFilter,
  formatFilter,
  GenericPageOptionsDto,
} from '../../../validation/filters';
import { Repository } from 'typeorm';
import { Customer, CustomerDTO } from '../models/customer.entity';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(body: CustomerDTO): Promise<Customer> {
    return this.customerRepository.save(body);
  }

  async findAll(
    @Query() filter?: GenericPageOptionsDto,
  ): Promise<[Customer[], number]> {
    let formattedFilter = formatFilter(filter);
    formattedFilter = checkNameFilter('name', filter, formattedFilter);
    return await this.customerRepository.findAndCount(formattedFilter);
  }

  async find(id: number): Promise<Customer> {
    return this.customerRepository.findOne(id);
  }

  async update(id: number, body: CustomerDTO): Promise<Customer> {
    return this.customerRepository.save({ id, ...body });
  }
}
