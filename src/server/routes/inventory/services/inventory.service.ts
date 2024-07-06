import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GenericPageOptionsDto } from '../../../validation/filters';
import {
  Inventory,
  InventoryDTO,
  InventoryListResponse,
  InventoryDocument,
} from '../models/inventory.model';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<InventoryDocument>,
  ) {}

  async create(body: InventoryDTO): Promise<InventoryDocument> {
    const inventory = new this.inventoryModel(body);
    return inventory.save();
  }

  async findAll(
    @Query() filter?: GenericPageOptionsDto,
  ): Promise<InventoryDocument[]> {
    return this.inventoryModel.find();
  }

  async update(id: string, body: InventoryDTO): Promise<InventoryDocument> {
    await this.find(id);
    return this.inventoryModel.findByIdAndUpdate(id, body, {
      new: true,
    });
  }

  async find(id: string): Promise<InventoryDocument> {
    const result = await this.inventoryModel.findById(id);

    if (!result) {
      throw new NotFoundException(
        `Could not find Inventory item with id: ${id}`,
      );
    }

    return result;
  }

  async seed() {
    const inventories = await this.findAll();
    if (!inventories.length) {
      const inventory1 = new this.inventoryModel({
        name: 'ChocolateRVs',
        manufactureDate: new Date('2020-01-01'),
        availableQuantity: 22,
      });
      await inventory1.save();

      const inventory2 = new this.inventoryModel({
        name: 'NuttyCars',
        manufactureDate: new Date('2021-02-01'),
        availableQuantity: 15,
      });
      await inventory2.save();

      const inventory3 = new this.inventoryModel({
        name: 'StickySliders',
        manufactureDate: new Date('2020-05-01'),
        availableQuantity: 10,
      });
      await inventory3.save();

      const inventory4 = new this.inventoryModel({
        name: 'ChocolateCruisers',
        manufactureDate: new Date('2022-06-01'),
        availableQuantity: 43,
      });
      await inventory4.save();

      const inventory5 = new this.inventoryModel({
        name: 'TaffyRollers',
        manufactureDate: new Date('2023-03-01'),
        availableQuantity: 12,
      });
      await inventory5.save();

      const inventory6 = new this.inventoryModel({
        name: 'SweetRides',
        manufactureDate: new Date('2020-09-01'),
        availableQuantity: 19,
      });
      await inventory6.save();

      const inventory7 = new this.inventoryModel({
        name: 'CandyCornRVs',
        manufactureDate: new Date('2021-10-01'),
        availableQuantity: 28,
      });
      await inventory7.save();
    }
  }
}
