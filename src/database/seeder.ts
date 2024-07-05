import { Injectable } from '@nestjs/common';
import { CustomerService } from '../routes/customer/services/customer.service';
import { OrderService } from '../routes/order/services/order.service';
import { StoreService } from '../routes/store/services/store.service';
import { InventoryService } from '../routes/inventory/services/inventory.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly customerService: CustomerService,
    private readonly inventoryService: InventoryService,
    private readonly orderService: OrderService,
    private readonly storeService: StoreService,
  ) {}
  async seed() {
    await Promise.all([
      this.customerService.seed(),
      this.inventoryService.seed(),
      this.storeService.seed(),
    ]);
    await this.orderService.seed();
  }
}
