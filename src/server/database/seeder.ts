import { Injectable } from '@nestjs/common';
import { InventoryService } from '../routes/inventory/services/inventory.service';

@Injectable()
export class Seeder {
  constructor(private readonly inventoryService: InventoryService) {}
  async seed() {
    await Promise.all([this.inventoryService.seed()]);
  }
}
