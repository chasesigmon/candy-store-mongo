import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { StorePageOptionsDto } from '../../../validation/filters';
import { Store, StoreDTO, StoreListResponse } from '../models/store.entity';
import { StoreRepository } from '../repositories/store.repository';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  async create(body: StoreDTO): Promise<Store> {
    return this.storeRepository.create(body);
  }

  async findAll(
    @Query() filter?: StorePageOptionsDto,
  ): Promise<StoreListResponse> {
    const result = await this.storeRepository.findAll(filter);
    return {
      items: result[0],
      totalCount: result[1],
    };
  }

  async update(id: string, body: StoreDTO): Promise<Store> {
    await this.find(id);
    return await this.storeRepository.update(parseInt(id), body);
  }

  async find(id: string): Promise<Store> {
    const result = await this.storeRepository.find(parseInt(id));

    if (!result) {
      throw new NotFoundException(`Could not find Store item with id: ${id}`);
    }

    return result;
  }

  async seed() {
    const stores = await this.findAll();
    if (!stores.items.length) {
      await this.storeRepository.create({
        address: '1000 Bounding Lane',
        managerName: 'John',
      });
      await this.storeRepository.create({
        address: '3345 Harper Road',
        managerName: 'Jane',
      });
      await this.storeRepository.create({
        address: '7612 Candy Drive',
        managerName: 'Hope',
      });
      await this.storeRepository.create({
        address: '1265 King Street',
        managerName: 'Derek',
      });
      await this.storeRepository.create({
        address: '9000 Langley Road',
        managerName: 'Ava',
      });
      await this.storeRepository.create({
        address: '3334 Carter Lane',
        managerName: 'Bill',
      });
      await this.storeRepository.create({
        address: '5409 Hillside Drive',
        managerName: 'Carter',
      });
    }
  }
}
