import { Module } from '@nestjs/common';

import { InventoryController } from './controllers/inventory.controller';
import { InventoryService } from './services/inventory.service';
import { Inventory } from './models/inventory.model';
import { InventoryResolver } from './controllers/inventory.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { InventorySchema } from './models/inventory.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Inventory.name,
        schema: InventorySchema,
      },
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryResolver, InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
