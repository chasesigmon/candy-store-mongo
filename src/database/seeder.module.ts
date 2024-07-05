import { Module } from '@nestjs/common';
import { InventoryModule } from '../routes/inventory/inventory.module';
import { DatabaseModule } from './database.module';
import { Seeder } from './seeder';

@Module({
  imports: [DatabaseModule, InventoryModule],
  providers: [Seeder],
})
export class SeederModule {}
