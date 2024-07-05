import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EntityManager, getConnection } from 'typeorm';
import {
  JwtGuardMock,
  TypeOrmSQLITETestingModule,
} from '../test-utils/TypeORMSQLITETestingModule';
import { StoreModule } from '../src/routes/store/store.module';
import { Store } from '../src/routes/store/models/store.entity';
import { JwtGuard } from '../src/routes/auth/jwt.guard';

describe('StoreController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule(), StoreModule],
    })
      .overrideGuard(JwtGuard)
      .useClass(JwtGuardMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const route = '/stores';

  describe(route, () => {
    let insertCount = 0;
    const firstNameAlphabetical = 'Alex';
    describe('(POST) create', () => {
      it('201 - should return a newly created Store item', async () => {
        const store = {
          address: '3489 Barbatos Road',
          managerName: 'Charles',
        };
        const response = await request(app.getHttpServer())
          .post(route)
          .send(store);
        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body.managerName).toEqual(store.managerName);
        insertCount++;
      });

      it('400 - should fail with a missing property', async () => {
        const store = {};
        const response = await request(app.getHttpServer())
          .post(route)
          .send(store);
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    describe('(PUT) update', () => {
      let id: string = '';
      beforeAll(async () => {
        const connection = await getConnection();
        const entityManager = connection.createEntityManager();
        entityManager.insert<Store>(Store, {
          address: '9000 Chalice Street',
          managerName: 'Hope',
        });
        insertCount++;
        const stores = await request(app.getHttpServer()).get(route);
        id = stores.body.items[0].id;
      });
      it('200 - should return an updated Store item', async () => {
        const store = {
          address: '1234 Alphabet Lane',
          managerName: firstNameAlphabetical,
        };
        const response = await request(app.getHttpServer())
          .put(`${route}/${id}`)
          .send(store);
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.managerName).toEqual(store.managerName);
      });

      it('400 - should fail with a missing property', async () => {
        const store = {};
        const response = await request(app.getHttpServer())
          .put(`${route}/${id}`)
          .send(store);
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });

      it('404 - should fail when id is non existent', async () => {
        const store = {
          address: '9876 Backwards Street',
          managerName: 'Harvey',
        };
        const response = await request(app.getHttpServer())
          .put(`${route}/30`)
          .send(store);
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      });
    });

    describe('(GET) findAll', () => {
      let connection;
      let entityManager: EntityManager;
      beforeAll(async () => {
        connection = await getConnection();
        entityManager = connection.createEntityManager();
        entityManager.insert<Store>(Store, {
          address: '4307 Tinkerbell Road',
          managerName: 'Phil',
        });
        entityManager.insert<Store>(Store, {
          address: '9999 Max Road',
          managerName: 'Kyra',
        });
        entityManager.insert<Store>(Store, {
          address: '1001 Heather Lane',
          managerName: 'Mike',
        });
        insertCount += 3;
      });

      it('200 - should return an array with all stores', async () => {
        const response = await request(app.getHttpServer()).get(route);
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(insertCount);
        expect(response.body.totalCount).toEqual(insertCount);
      });

      it('200 - should return an array with 1 stores when given pageSize=1', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/?pageSize=1`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(1);
        expect(response.body.totalCount).toEqual(insertCount);
      });

      it('200 - should return an array with 1 stores when given page=1 & pageSize=1', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/?page=1&pageSize=1`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(1);
        expect(response.body.totalCount).toEqual(insertCount);
      });

      it('200 - should return an array with all stores orderedBy managerName', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/?orderBy=managerName`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(insertCount);
        expect(response.body.totalCount).toEqual(insertCount);
        expect(response.body.items[0].managerName).toEqual(
          firstNameAlphabetical,
        );
      });

      it('200 - should return an array with a matching store managerName', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/?filter={'managerName': ${firstNameAlphabetical}}`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(insertCount);
        expect(response.body.totalCount).toEqual(insertCount);
        expect(response.body.items[0].managerName).toEqual(
          firstNameAlphabetical,
        );
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
        entityManager.insert<Store>(Store, {
          address: '7965 Long Lane',
          managerName: 'Beth',
        });
        insertCount++;
        const stores = await request(app.getHttpServer()).get(route);
        id = stores.body.items[0].id;
      });

      it('200 - should return a single Store item', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/${id}`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toBeDefined();
        expect(response.body.managerName).toBeDefined();
      });

      it('404 - should fail when id is non existent', async () => {
        const response = await request(app.getHttpServer()).get(`${route}/30`);
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      });
    });
  });
});
