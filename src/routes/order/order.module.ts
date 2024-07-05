import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { Order } from './models/order.entity';
import { OrderRepository } from './repositories/order.repository';
import { InventoryModule } from '../inventory/inventory.module';
import { CustomerModule } from '../customer/customer.module';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    InventoryModule,
    CustomerModule,
    StoreModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
