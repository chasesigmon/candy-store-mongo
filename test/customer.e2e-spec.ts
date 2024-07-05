import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EntityManager, getConnection } from 'typeorm';
import {
  JwtGuardMock,
  TypeOrmSQLITETestingModule,
} from '../test-utils/TypeORMSQLITETestingModule';
import { CustomerModule } from '../src/routes/customer/customer.module';
import { Customer } from '../src/routes/customer/models/customer.entity';
import { JwtGuard } from '../src/routes/auth/jwt.guard';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule(), CustomerModule],
    })
      .overrideGuard(JwtGuard)
      .useClass(JwtGuardMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const route = '/customers';

  describe(route, () => {
    let insertCount = 0;
    const firstNameAlphabetical = 'Bill';
    describe('(POST) create', () => {
      it('201 - should return a newly created Customer item', async () => {
        const customer = {
          name: 'Tom',
        };
        const response = await request(app.getHttpServer())
          .post(route)
          .send(customer);
        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body.name).toEqual(customer.name);
        insertCount++;
      });

      it('400 - should fail with a missing property', async () => {
        const customer = {};
        const response = await request(app.getHttpServer())
          .post(route)
          .send(customer);
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    describe('(PUT) update', () => {
      let id: string = '';
      beforeAll(async () => {
        const connection = await getConnection();
        const entityManager = connection.createEntityManager();
        entityManager.insert<Customer>(Customer, {
          name: 'Jill',
        });
        insertCount++;
        const customers = await request(app.getHttpServer()).get(route);
        id = customers.body.items[0].id;
      });
      it('200 - should return an updated Customer item', async () => {
        const customer = {
          name: firstNameAlphabetical,
        };
        const response = await request(app.getHttpServer())
          .put(`${route}/${id}`)
          .send(customer);
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.name).toEqual(customer.name);
      });

      it('400 - should fail with a missing property', async () => {
        const customer = {};
        const response = await request(app.getHttpServer())
          .put(`${route}/${id}`)
          .send(customer);
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });

      it('404 - should fail when id is non existent', async () => {
        const customer = {
          name: 'Fran',
        };
        const response = await request(app.getHttpServer())
          .put(`${route}/30`)
          .send(customer);
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      });
    });

    describe('(GET) findAll', () => {
      let connection;
      let entityManager: EntityManager;
      beforeAll(async () => {
        connection = await getConnection();
        entityManager = connection.createEntityManager();
        entityManager.insert<Customer>(Customer, {
          name: 'Jake',
        });
        entityManager.insert<Customer>(Customer, {
          name: 'Tammy',
        });
        entityManager.insert<Customer>(Customer, {
          name: 'Carl',
        });
        insertCount += 3;
      });

      it('200 - should return an array with all customers', async () => {
        const response = await request(app.getHttpServer()).get(route);
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(insertCount);
        expect(response.body.totalCount).toEqual(insertCount);
      });

      it('200 - should return an array with 1 customers when given pageSize=1', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/?pageSize=1`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(1);
        expect(response.body.totalCount).toEqual(insertCount);
      });

      it('200 - should return an array with 1 customers when given page=1 & pageSize=1', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/?page=1&pageSize=1`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(1);
        expect(response.body.totalCount).toEqual(insertCount);
      });

      it('200 - should return an array with all customers orderedBy name', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/?orderBy=name`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(insertCount);
        expect(response.body.totalCount).toEqual(insertCount);
        expect(response.body.items[0].name).toEqual(firstNameAlphabetical);
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
        entityManager.insert<Customer>(Customer, {
          name: 'Jen',
        });
        insertCount++;
        const customers = await request(app.getHttpServer()).get(route);
        id = customers.body.items[0].id;
      });

      it('200 - should return a single Customer item', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/${id}`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toBeDefined();
        expect(response.body.name).toBeDefined();
      });

      it('404 - should fail when id is non existent', async () => {
        const response = await request(app.getHttpServer()).get(`${route}/30`);
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      });
    });
  });
});
