import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EntityManager, getConnection } from 'typeorm';
import {
  JwtGuardMock,
  TypeOrmSQLITETestingModule,
} from '../test-utils/TypeORMSQLITETestingModule';
import { OrderModule } from '../src/routes/order/order.module';
import { Order, StatusEnum } from '../src/routes/order/models/order.entity';
import { Customer } from '../src/routes/customer/models/customer.entity';
import { Inventory } from '../src/routes/inventory/models/inventory.entity';
import { Store } from '../src/routes/store/models/store.entity';
import { JwtGuard } from '../src/routes/auth/jwt.guard';

describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let customerId1, customerId2, storeId1, storeId2, inventoryId1, inventoryId2;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule(), OrderModule],
      providers: [],
    })
      .overrideGuard(JwtGuard)
      .useClass(JwtGuardMock)
      .compile();

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

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const route = '/orders';

  describe(route, () => {
    let insertCount = 0;
    let pendingCount = 0;
    describe('(POST) create', () => {
      it('201 - should return a newly created Order item', async () => {
        const order = {
          customerId: customerId1,
          inventoryId: inventoryId1,
          storeId: storeId1,
          quantity: 1,
        };
        const response = await request(app.getHttpServer())
          .post(route)
          .send(order);
        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body.customerId).toEqual(order.customerId);
        insertCount++;
      });

      it('400 - should fail with a missing property', async () => {
        const order = {};
        const response = await request(app.getHttpServer())
          .post(route)
          .send(order);
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    describe('(PATCH) update', () => {
      let id: string = '';
      beforeAll(async () => {
        const connection = await getConnection();
        const entityManager = connection.createEntityManager();
        entityManager.insert<Order>(Order, {
          customerId: customerId2,
          inventoryId: inventoryId2,
          storeId: storeId2,
          quantity: 15,
          status: StatusEnum.PENDING,
        });
        insertCount++;
        pendingCount++;
        const orders = await request(app.getHttpServer()).get(route);
        id = orders.body.items[0].id;
      });
      it('200 - should return a patched Order item', async () => {
        const order = {
          status: StatusEnum.DELIVERED,
        };
        const response = await request(app.getHttpServer())
          .patch(`${route}/${id}`)
          .send(order);
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.status).toEqual(order.status);
      });

      it('400 - should fail with a missing property', async () => {
        const order = {};
        const response = await request(app.getHttpServer())
          .patch(`${route}/${id}`)
          .send(order);
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });

      it('404 - should fail when id is non existent', async () => {
        const order = {
          status: StatusEnum.DELIVERED,
        };
        const response = await request(app.getHttpServer())
          .patch(`${route}/30`)
          .send(order);
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      });
    });

    describe('(GET) findAll', () => {
      let connection;
      let entityManager: EntityManager;
      beforeAll(async () => {
        connection = await getConnection();
        entityManager = connection.createEntityManager();
        entityManager.insert<Order>(Order, {
          customerId: customerId2,
          inventoryId: inventoryId2,
          storeId: storeId1,
          quantity: 100,
          status: StatusEnum.PENDING,
        });
        pendingCount++;
        entityManager.insert<Order>(Order, {
          customerId: customerId1,
          inventoryId: inventoryId2,
          storeId: storeId1,
          quantity: 50,
          status: StatusEnum.CANCELLED,
        });
        entityManager.insert<Order>(Order, {
          customerId: customerId1,
          inventoryId: inventoryId2,
          storeId: storeId2,
          quantity: 30,
          status: StatusEnum.DELIVERED,
        });
        insertCount += 3;
      });

      it('200 - should return an array with all orders', async () => {
        const response = await request(app.getHttpServer()).get(route);
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(insertCount);
        expect(response.body.totalCount).toEqual(insertCount);
      });

      it('200 - should return an array with 1 orders when given pageSize=1', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/?pageSize=1`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(1);
        expect(response.body.totalCount).toEqual(insertCount);
      });

      it('200 - should return an array with 1 orders when given page=1 & pageSize=1', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/?page=1&pageSize=1`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(1);
        expect(response.body.totalCount).toEqual(insertCount);
      });

      it('200 - should return an array with all orders orderedBy status', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/?orderBy=status`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(insertCount);
        expect(response.body.totalCount).toEqual(insertCount);
        expect(response.body.items[0].status).toEqual(StatusEnum.CANCELLED);
      });

      it('200 - should return an array with a matching order status', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/?filter={"status": "${StatusEnum.PENDING}"}`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(pendingCount);
        expect(response.body.totalCount).toEqual(pendingCount);
        expect(response.body.items[0].status).toEqual(StatusEnum.PENDING);
      });

      it('200 - should return an empty array when page is outside the bounds', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}?page=1000`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(0);
        expect(response.body.totalCount).toEqual(insertCount);
      });
    });

    describe('(GET) find', () => {
      let id: string = '';
      beforeAll(async () => {
        const connection = await getConnection();
        const entityManager = connection.createEntityManager();
        entityManager.insert<Order>(Order, {
          customerId: customerId1,
          inventoryId: inventoryId2,
          storeId: storeId2,
          quantity: 30,
          status: StatusEnum.PENDING,
        });
        insertCount++;
        const orders = await request(app.getHttpServer()).get(route);
        id = orders.body.items[0].id;
      });

      it('200 - should return a single Order item', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/${id}`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toBeDefined();
        expect(response.body.status).toBeDefined();
      });

      it('404 - should fail when id is non existent', async () => {
        const response = await request(app.getHttpServer()).get(`${route}/30`);
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      });
    });
  });
});
