import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager, getConnection } from 'typeorm';
import { TypeOrmSQLITETestingModule } from '../../../../test-utils/TypeORMSQLITETestingModule';
import { StoreModule } from '../store.module';
import { Store, StoreDTO } from '../models/store.entity';
import { StoreController } from './store.controller';

describe('StoreController', () => {
  let storeController: StoreController;
  let insertCount = 0;
  let firstRecordName = '';

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule(), StoreModule],
    }).compile();

    storeController = app.get<StoreController>(StoreController);
  });

  it('controller should be defined', () => {
    expect(storeController).toBeDefined();
  });

  describe('create()', () => {
    it('should succeed and return with a newly created store item', async () => {
      const store: StoreDTO = {
        address: '1010 Downey Street',
        managerName: 'Tim',
      };
      const result = await storeController.create(store);
      expect(result).toBeDefined();
      expect(result.managerName).toEqual(store.managerName);
      insertCount++;
    });
  });

  describe('update()', () => {
    let connection;
    let entityManager: EntityManager;
    beforeAll(async () => {
      connection = await getConnection();
      entityManager = connection.createEntityManager();
      entityManager.insert<Store>(Store, {
        address: '3910 Hillside Street',
        managerName: 'Sally',
      });
      insertCount++;
    });

    it('should succeed and return with an updated store item', async () => {
      firstRecordName = 'Rebecca';
      const store = {
        address: '1287 Green Road',
        managerName: firstRecordName,
      };
      const customers = await storeController.findAll();
      const id = customers.items[0].id.toString();
      const result = await storeController.update({ id }, store);
      expect(result).toBeDefined();
      expect(result.managerName).toEqual(store.managerName);
    });
  });

  describe('findAll()', () => {
    let connection;
    let entityManager: EntityManager;
    beforeAll(async () => {
      connection = await getConnection();
      entityManager = connection.createEntityManager();
      entityManager.insert<Store>(Store, {
        address: '7823 Harper Lane',
        managerName: 'Nyles',
      });
      insertCount++;
    });

    it('should succeed and return with an array of stores', async () => {
      const result = await storeController.findAll();
      expect(result.items).toBeDefined();
      expect(result.items.length).toEqual(insertCount);
    });
  });

  describe('find()', () => {
    it('should succeed and return with a store item', async () => {
      const stores = await storeController.findAll();
      const id = stores.items[0].id.toString();
      const result = await storeController.find({ id });
      expect(result).toBeDefined();
      expect(result.managerName).toEqual(firstRecordName);
    });
  });
});
