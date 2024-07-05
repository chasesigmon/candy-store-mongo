import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../src/routes/store/models/store.entity';
import { Customer } from '../src/routes/customer/models/customer.entity';
import { Inventory } from '../src/routes/inventory/models/inventory.entity';
import { Order } from '../src/routes/order/models/order.entity';
import { CanActivate } from '@nestjs/common';

export const TypeOrmSQLITETestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: [Inventory, Customer, Store, Order],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([Inventory, Customer, Store, Order]),
];

export class JwtGuardMock implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}
