import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager, getConnection } from 'typeorm';
import { TypeOrmSQLITETestingModule } from '../../../../test-utils/TypeORMSQLITETestingModule';
import { CustomerModule } from '../customer.module';
import { Customer, CustomerDTO } from '../models/customer.entity';
import { CustomerController } from './customer.controller';

describe('CustomerController', () => {
  let customerController: CustomerController;
  let insertCount = 0;
  let firstRecordName = '';

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule(), CustomerModule],
    }).compile();

    customerController = app.get<CustomerController>(CustomerController);
  });

  it('controller should be defined', () => {
    expect(customerController).toBeDefined();
  });

  describe('create()', () => {
    it('should succeed and return with a newly created customer item', async () => {
      const customer: CustomerDTO = {
        name: 'Tom',
      };
      const result = await customerController.create(customer);
      expect(result).toBeDefined();
      expect(result.name).toEqual(customer.name);
      insertCount++;
    });
  });

  describe('update()', () => {
    let connection;
    let entityManager: EntityManager;
    beforeAll(async () => {
      connection = await getConnection();
      entityManager = connection.createEntityManager();
      entityManager.insert<Customer>(Customer, {
        name: 'Billy',
      });
      insertCount++;
    });

    it('should succeed and return with an updated customer item', async () => {
      firstRecordName = 'Jillian';
      const customer = {
        name: firstRecordName,
      };
      const customers = await customerController.findAll();
      const id = customers.items[0].id.toString();
      const result = await customerController.update({ id }, customer);
      expect(result).toBeDefined();
      expect(result.name).toEqual(customer.name);
    });
  });

  describe('findAll()', () => {
    let connection;
    let entityManager: EntityManager;
    beforeAll(async () => {
      connection = await getConnection();
      entityManager = connection.createEntityManager();
      entityManager.insert<Customer>(Customer, {
        name: 'Mark',
      });
      insertCount++;
    });

    it('should succeed and return with an array of customers', async () => {
      const result = await customerController.findAll();
      expect(result.items).toBeDefined();
      expect(result.items.length).toEqual(insertCount);
    });
  });

  describe('find()', () => {
    it('should succeed and return with an customer item', async () => {
      const customers = await customerController.findAll();
      const id = customers.items[0].id.toString();
      const result = await customerController.find({ id });
      expect(result).toBeDefined();
      expect(result.name).toEqual(firstRecordName);
    });
  });
});
