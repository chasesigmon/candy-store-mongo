import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  checkNameFilter,
  formatFilter,
  StorePageOptionsDto,
} from '../../../validation/filters';
import { Repository } from 'typeorm';
import { Store, StoreDTO } from '../models/store.entity';

@Injectable()
export class StoreRepository {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(body: StoreDTO): Promise<Store> {
    return this.storeRepository.save(body);
  }

  async findAll(
    @Query() filter?: StorePageOptionsDto,
  ): Promise<[Store[], number]> {
    let formattedFilter = formatFilter(filter);
    formattedFilter = checkNameFilter('managerName', filter, formattedFilter);
    return await this.storeRepository.findAndCount(formattedFilter);
  }

  async find(id: number): Promise<Store> {
    return this.storeRepository.findOne(id);
  }

  async update(id: number, body: StoreDTO): Promise<Store> {
    return this.storeRepository.save({ id, ...body });
  }
}
