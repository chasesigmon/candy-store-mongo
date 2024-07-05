import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager, getConnection } from 'typeorm';
import { TypeOrmSQLITETestingModule } from '../../../../test-utils/TypeORMSQLITETestingModule';
import { OrderModule } from '../order.module';
import { Order, CreateOrderDTO, StatusEnum } from '../models/order.entity';
import { OrderController } from './order.controller';
import { Customer } from '../../customer/models/customer.entity';
import { Store } from '../../store/models/store.entity';
import { Inventory } from '../../inventory/models/inventory.entity';

describe('OrderController', () => {
  let orderController: OrderController;
  let insertCount = 0;
  let customerId1, customerId2, storeId1, storeId2, inventoryId1, inventoryId2;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule(), OrderModule],
    }).compile();

    orderController = app.get<OrderController>(OrderController);

    const connection = await getConnection();
    const entityManager = connection.createEntityManager();

    const customer1 = await entityManager.insert<Customer>(Customer, {
      name: 'Jill',
    });
    const store1 = await entityManager.insert<Store>(Store, {
      address: '3489 Barbatos Road',
      managerName: 'Charles',
    });
    const inventory1 = await entityManager.insert<Inventory>(Inventory, {
      name: 'ChocolateCars',
      manufactureDate: '2021-05-05',
      availableQuantity: 20,
    });

    const customer2 = await entityManager.insert<Customer>(Customer, {
      name: 'Carlos',
    });
    const store2 = await entityManager.insert<Store>(Store, {
      address: '6723 Barbatos Road',
      managerName: 'Janice',
    });
    const inventory2 = await entityManager.insert<Inventory>(Inventory, {
      name: 'CandyRVs',
      manufactureDate: '2022-05-05',
      availableQuantity: 10,
    });

    customerId1 = customer1.identifiers[0].id;
    storeId1 = store1.identifiers[0].id;
    inventoryId1 = inventory1.identifiers[0].id;
    customerId2 = customer2.identifiers[0].id;
    storeId2 = store2.identifiers[0].id;
    inventoryId2 = inventory2.identifiers[0].id;
  });

  it('controller should be defined', () => {
    expect(orderController).toBeDefined();
  });

  describe('create()', () => {
    it('should succeed and return with a newly created order item', async () => {
      const order: CreateOrderDTO = {
        customerId: customerId1,
        inventoryId: inventoryId1,
        storeId: storeId1,
        quantity: 1,
      };
      const result = await orderController.create(order);
      expect(result).toBeDefined();
      expect(result.customerId).toEqual(order.customerId);
      insertCount++;
    });
  });

  describe('patch()', () => {
    let connection;
    let entityManager: EntityManager;
    beforeAll(async () => {
      connection = await getConnection();
      entityManager = connection.createEntityManager();
      entityManager.insert<Order>(Order, {
        customerId: customerId1,
        inventoryId: inventoryId1,
        storeId: storeId1,
        quantity: 20,
      });
      insertCount++;
    });

    it('should succeed and return with a patched order item', async () => {
      const order = {
        status: StatusEnum.DELIVERED,
      };
      const orders = await orderController.findAll();
      const id = orders.items[0].id.toString();
      const result = await orderController.patch({ id }, order);
      expect(result).toBeDefined();
      expect(result.status).toEqual(order.status);
    });
  });

  describe('findAll()', () => {
    let connection;
    let entityManager: EntityManager;
    beforeAll(async () => {
      connection = await getConnection();
      entityManager = connection.createEntityManager();
      entityManager.insert<Order>(Order, {
        customerId: customerId2,
        inventoryId: inventoryId2,
        storeId: storeId2,
        quantity: 30,
      });
      insertCount++;
    });

    it('should succeed and return with an array of orders', async () => {
      const result = await orderController.findAll();
      expect(result.items).toBeDefined();
      expect(result.items.length).toEqual(insertCount);
    });
  });

  describe('find()', () => {
    it('should succeed and return with an order item', async () => {
      const orders = await orderController.findAll();
      const id = orders.items[0].id.toString();
      const result = await orderController.find({ id });
      expect(result).toBeDefined();
      expect(result.status).toEqual(StatusEnum.DELIVERED);
    });
  });
});
