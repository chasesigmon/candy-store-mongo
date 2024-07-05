import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '../customer/customer.module';
import { InventoryModule } from '../inventory/inventory.module';
import { Order } from '../order/models/order.entity';
import { OrderRepository } from '../order/repositories/order.repository';
import { OrderService } from '../order/services/order.service';
import { StoreModule } from '../store/store.module';
import { ReportController } from './controllers/report.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    InventoryModule,
    CustomerModule,
    StoreModule,
  ],
  controllers: [ReportController],
  providers: [OrderService, OrderRepository],
})
export class ReportModule {}
