import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { formatFilter, OrderPageOptionsDto } from '../../../validation/filters';
import { Repository } from 'typeorm';
import {
  Order,
  CreateOrderDTO,
  UpdateOrderDTO,
  StatusEnum,
} from '../models/order.entity';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(body: CreateOrderDTO): Promise<Order> {
    return this.orderRepository.save({
      ...body,
      status: StatusEnum.PENDING,
      createDate: new Date(),
    });
  }

  async findAll(
    @Query() filter?: OrderPageOptionsDto,
  ): Promise<[Order[], number]> {
    let formattedFilter = formatFilter(filter);

    if (filter?.filter) {
      try {
        const parsed = JSON.parse(filter.filter);
        formattedFilter.where = {};
        parsed.customerId &&
          (formattedFilter.where = {
            ...formattedFilter.where,
            customerId: parsed.customerId,
          });
        parsed.inventoryId &&
          (formattedFilter.where = {
            ...formattedFilter.where,
            inventoryId: parsed.inventoryId,
          });
        parsed.storeId &&
          (formattedFilter.where = {
            ...formattedFilter.where,
            storeId: parsed.storeId,
          });
        parsed.status &&
          (formattedFilter.where = {
            ...formattedFilter.where,
            status: parsed.status,
          });
      } catch (err) {
        // catch and disregard error if invalid JSON was passed in
      }
    }

    return await this.orderRepository.findAndCount(formattedFilter);
  }

  async find(id: string): Promise<Order> {
    return this.orderRepository.findOne(parseInt(id));
  }

  async patch(id: string, body: UpdateOrderDTO): Promise<Order> {
    return this.orderRepository.save({
      id: parseInt(id),
      ...body,
      updateDate: new Date(),
    });
  }

  async report() {
    // current month report
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return await this.orderRepository
      .createQueryBuilder('order')
      .where(`createDate >= :firstDay AND createDate <= :lastDay`, {
        firstDay,
        lastDay,
      })
      .groupBy('storeId')
      .addGroupBy('status')
      .getMany();
  }
}
