import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager, getConnection } from 'typeorm';
import { TypeOrmSQLITETestingModule } from '../../../../test-utils/TypeORMSQLITETestingModule';
import { InventoryModule } from '../inventory.module';
import { Inventory } from '../models/inventory.entity';
import { InventoryController } from './inventory.controller';

describe('InventoryController', () => {
  let inventoryController: InventoryController;
  let insertCount = 0;
  let firstRecordName = '';

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule(), InventoryModule],
    }).compile();

    inventoryController = app.get<InventoryController>(InventoryController);
  });

  it('controller should be defined', () => {
    expect(inventoryController).toBeDefined();
  });

  describe('create()', () => {
    it('should succeed and return with a newly created inventory item', async () => {
      const inventory = {
        name: 'ChocolateCars',
        manufactureDate: new Date('2021-05-05'),
        availableQuantity: 30,
      };
      const result = await inventoryController.create(inventory);
      expect(result).toBeDefined();
      expect(result.name).toEqual(inventory.name);
      insertCount++;
    });
  });

  describe('update()', () => {
    let connection;
    let entityManager: EntityManager;
    beforeAll(async () => {
      connection = await getConnection();
      entityManager = connection.createEntityManager();
      entityManager.insert<Inventory>(Inventory, {
        name: 'ChocolateCars',
        manufactureDate: '2022-01-20',
        availableQuantity: 3,
      });
      insertCount++;
    });

    it('should succeed and return with an updated inventory item', async () => {
      firstRecordName = 'ChocolateCruisers';
      const inventory = {
        name: firstRecordName,
        manufactureDate: new Date('2023-05-05'),
        availableQuantity: 30,
      };
      const inventories = await inventoryController.findAll();
      const id = inventories.items[0].id.toString();
      const result = await inventoryController.update({ id }, inventory);
      expect(result).toBeDefined();
      expect(result.name).toEqual(inventory.name);
    });
  });

  describe('findAll()', () => {
    let connection;
    let entityManager: EntityManager;
    beforeAll(async () => {
      connection = await getConnection();
      entityManager = connection.createEntityManager();
      entityManager.insert<Inventory>(Inventory, {
        name: 'ChocolateRVs',
        manufactureDate: '2022-01-20',
        availableQuantity: 3,
      });
      insertCount++;
    });

    it('should succeed and return with an array of inventories', async () => {
      const result = await inventoryController.findAll();
      expect(result.items).toBeDefined();
      expect(result.items.length).toEqual(insertCount);
    });
  });

  describe('find()', () => {
    it('should succeed and return with an inventory item', async () => {
      const inventory = await inventoryController.findAll();
      const id = inventory.items[0].id.toString();
      const result = await inventoryController.find({ id });
      expect(result).toBeDefined();
      expect(result.name).toEqual(firstRecordName);
    });
  });
});
