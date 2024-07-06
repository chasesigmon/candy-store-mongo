import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { JwtGuard } from '../../auth/jwt.guard';
import {
  Inventory,
  InventoryDTO,
  InventoryListResponse,
} from '../models/inventory.model';
import { InventoryService } from '../services/inventory.service';

@Resolver(() => Inventory)
@UseGuards(JwtGuard)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}
  @Mutation(() => Inventory)
  create(@Args('body') body: InventoryDTO) {
    return this.inventoryService.create(body);
  }

  @Query(() => [Inventory], { name: 'inventories' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Query(() => Inventory, { name: 'inventory' })
  find(@Args('id', { type: () => String }) id: string) {
    return this.inventoryService.find(id);
  }

  @Mutation(() => Inventory)
  update(
    @Args('id', { type: () => String }) id: string,
    @Args('body') body: InventoryDTO,
  ) {
    return this.inventoryService.update(id, body);
  }
}
