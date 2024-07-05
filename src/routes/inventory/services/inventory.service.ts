import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { GenericPageOptionsDto } from '../../../validation/filters';
import {
  Inventory,
  InventoryDTO,
  InventoryListResponse,
} from '../models/inventory.entity';
import { InventoryRepository } from '../repositories/inventory.repository';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async create(body: InventoryDTO): Promise<Inventory> {
    return this.inventoryRepository.create(body);
  }

  async findAll(
    @Query() filter?: GenericPageOptionsDto,
  ): Promise<InventoryListResponse> {
    const result = await this.inventoryRepository.findAll(filter);
    return {
      items: result[0],
      totalCount: result[1],
    };
  }

  async update(id: string, body: InventoryDTO): Promise<Inventory> {
    await this.find(id);
    return await this.inventoryRepository.update(parseInt(id), body);
  }

  async find(id: string): Promise<Inventory> {
    const result = await this.inventoryRepository.find(parseInt(id));

    if (!result) {
      throw new NotFoundException(
        `Could not find Inventory item with id: ${id}`,
      );
    }

    return result;
  }

  async seed() {
    const inventories = await this.findAll();
    if (!inventories.items.length) {
      await this.inventoryRepository.create({
        name: 'ChocolateRVs',
        manufactureDate: new Date('2020-01-01'),
        availableQuantity: 22,
      });
      await this.inventoryRepository.create({
        name: 'NuttyCars',
        manufactureDate: new Date('2021-02-01'),
        availableQuantity: 15,
      });
      await this.inventoryRepository.create({
        name: 'StickySliders',
        manufactureDate: new Date('2020-05-01'),
        availableQuantity: 10,
      });
      await this.inventoryRepository.create({
        name: 'ChocolateCruisers',
        manufactureDate: new Date('2022-06-01'),
        availableQuantity: 43,
      });
      await this.inventoryRepository.create({
        name: 'TaffyRollers',
        manufactureDate: new Date('2023-03-01'),
        availableQuantity: 12,
      });
      await this.inventoryRepository.create({
        name: 'SweetRides',
        manufactureDate: new Date('2020-09-01'),
        availableQuantity: 19,
      });
      await this.inventoryRepository.create({
        name: 'CandyCornRVs',
        manufactureDate: new Date('2021-10-01'),
        availableQuantity: 28,
      });
    }
  }
}
