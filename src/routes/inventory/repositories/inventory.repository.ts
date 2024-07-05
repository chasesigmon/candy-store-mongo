import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  checkNameFilter,
  formatFilter,
  GenericPageOptionsDto,
} from '../../../validation/filters';
import { Repository } from 'typeorm';
import { Inventory, InventoryDTO } from '../models/inventory.entity';

@Injectable()
export class InventoryRepository {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async create(body: InventoryDTO): Promise<Inventory> {
    return this.inventoryRepository.save(body);
  }

  async findAll(
    @Query() filter?: GenericPageOptionsDto,
  ): Promise<[Inventory[], number]> {
    let formattedFilter = formatFilter(filter);
    formattedFilter = checkNameFilter('name', filter, formattedFilter);
    return await this.inventoryRepository.findAndCount(formattedFilter);
  }

  async find(id: number): Promise<Inventory> {
    return this.inventoryRepository.findOne(id);
  }

  async update(id: number, body: InventoryDTO): Promise<Inventory> {
    return this.inventoryRepository.save({ id, ...body });
  }
}
