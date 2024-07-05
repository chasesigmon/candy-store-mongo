import { Module } from '@nestjs/common';
import { CustomerModule } from '../routes/customer/customer.module';
import { OrderModule } from '../routes/order/order.module';
import { StoreModule } from '../routes/store/store.module';
import { InventoryModule } from '../routes/inventory/inventory.module';
import { DatabaseModule } from './database.module';
import { Seeder } from './seeder';

@Module({
  imports: [
    DatabaseModule,
    InventoryModule,
    CustomerModule,
    StoreModule,
    OrderModule,
  ],
  providers: [Seeder],
})
export class SeederModule {}
