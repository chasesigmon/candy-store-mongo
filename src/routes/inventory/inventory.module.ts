import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InventoryController } from './controllers/inventory.controller';
import { InventoryService } from './services/inventory.service';
import { Inventory } from './models/inventory.entity';
import { InventoryRepository } from './repositories/inventory.repository';
import { InventoryResolver } from './controllers/inventory.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory])],
  controllers: [InventoryController],
  providers: [InventoryResolver, InventoryService, InventoryRepository],
  exports: [InventoryService, InventoryRepository],
})
export class InventoryModule {}
