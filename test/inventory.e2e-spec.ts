// import { Test, TestingModule } from '@nestjs/testing';
// import { HttpStatus, INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { EntityManager, getConnection } from 'typeorm';
// import {
//   JwtGuardMock,
//   TypeOrmSQLITETestingModule,
// } from '../test-utils/TypeORMSQLITETestingModule';
// import { InventoryModule } from '../src/routes/inventory/inventory.module';
// import { Inventory } from '../src/routes/inventory/models/inventory.entity';
// import { JwtGuard } from '../src/routes/auth/jwt.guard';

// describe('InventoryController (e2e)', () => {
//   let app: INestApplication;

//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [...TypeOrmSQLITETestingModule(), InventoryModule],
//     })
//       .overrideGuard(JwtGuard)
//       .useClass(JwtGuardMock)
//       .compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   const route = '/inventories';

//   describe(route, () => {
//     let insertCount = 0;
//     describe('(POST) create', () => {
//       it('201 - should return a newly created inventory item', async () => {
//         const inventory = {
//           name: 'ChocolateCars',
//           manufactureDate: '2021-05-05',
//           availableQuantity: 20,
//         };
//         const response = await request(app.getHttpServer())
//           .post(route)
//           .send(inventory);
//         expect(response.statusCode).toBe(HttpStatus.CREATED);
//         expect(response.body.name).toEqual(inventory.name);
//         insertCount++;
//       });

//       it('400 - should fail with a missing property', async () => {
//         const inventory = {
//           name: 'ChocolateCars',
//           manufactureDate: '2021-05-05',
//         };
//         const response = await request(app.getHttpServer())
//           .post(route)
//           .send(inventory);
//         expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
//       });

//       it('400 - should fail with an invalid property', async () => {
//         const inventory = {
//           name: 'ChocolateCars',
//           manufactureDate: 'test',
//           availableQuantity: 20,
//         };
//         const response = await request(app.getHttpServer())
//           .post(route)
//           .send(inventory);
//         expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
//       });
//     });

//     describe('(PUT) update', () => {
//       let id: string = '';
//       beforeAll(async () => {
//         const connection = await getConnection();
//         const entityManager = connection.createEntityManager();
//         entityManager.insert<Inventory>(Inventory, {
//           name: 'ChocolateCars',
//           manufactureDate: '2022-01-20',
//           availableQuantity: 3,
//         });
//         insertCount++;
//         const inventories = await request(app.getHttpServer()).get(route);
//         id = inventories.body.items[0].id;
//       });
//       it('200 - should return an updated inventory item', async () => {
//         const inventory = {
//           name: 'ChocolateCruisers',
//           manufactureDate: '2022-01-20',
//           availableQuantity: 30,
//         };
//         const response = await request(app.getHttpServer())
//           .put(`${route}/${id}`)
//           .send(inventory);
//         expect(response.statusCode).toBe(HttpStatus.OK);
//         expect(response.body.name).toEqual(inventory.name);
//       });

//       it('400 - should fail with a missing property', async () => {
//         const inventory = {
//           name: 'ChocolateCars',
//           manufactureDate: '2021-05-05',
//         };
//         const response = await request(app.getHttpServer())
//           .put(`${route}/${id}`)
//           .send(inventory);
//         expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
//       });

//       it('404 - should fail when id is non existent', async () => {
//         const inventory = {
//           name: 'ChocolateCars',
//           manufactureDate: '2021-05-05',
//           availableQuantity: 20,
//         };
//         const response = await request(app.getHttpServer())
//           .put(`${route}/30`)
//           .send(inventory);
//         expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
//       });

//       it('400 - should fail with an invalid property value', async () => {
//         const inventory = {
//           name: 'ChocolateCars',
//           manufactureDate: 'test',
//           availableQuantity: 20,
//         };
//         const response = await request(app.getHttpServer())
//           .put(`${route}/${id}`)
//           .send(inventory);
//         expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
//       });
//     });

//     describe('(GET) findAll', () => {
//       let connection;
//       let entityManager: EntityManager;
//       const lowestQuantity = 3;
//       beforeAll(async () => {
//         connection = await getConnection();
//         entityManager = connection.createEntityManager();
//         entityManager.insert<Inventory>(Inventory, {
//           name: 'ChocolateCruisers',
//           manufactureDate: '2022-01-20',
//           availableQuantity: lowestQuantity,
//         });
//         entityManager.insert<Inventory>(Inventory, {
//           name: 'TaffyVehicles',
//           manufactureDate: '2022-06-20',
//           availableQuantity: 15,
//         });
//         entityManager.insert<Inventory>(Inventory, {
//           name: 'CandyPopCars',
//           manufactureDate: '2023-01-20',
//           availableQuantity: 20,
//         });
//         insertCount += 3;
//       });

//       it('200 - should return an array with all inventories', async () => {
//         const response = await request(app.getHttpServer()).get(route);
//         expect(response.statusCode).toBe(HttpStatus.OK);
//         expect(response.body.items).toBeDefined();
//         expect(response.body.items.length).toEqual(insertCount);
//         expect(response.body.totalCount).toEqual(insertCount);
//       });

//       it('200 - should return an array with 1 inventories when given pageSize=1', async () => {
//         const response = await request(app.getHttpServer()).get(
//           `${route}/?pageSize=1`,
//         );
//         expect(response.statusCode).toBe(HttpStatus.OK);
//         expect(response.body.items).toBeDefined();
//         expect(response.body.items.length).toEqual(1);
//         expect(response.body.totalCount).toEqual(insertCount);
//       });

//       it('200 - should return an array with 1 inventories when given page=1 & pageSize=1', async () => {
//         const response = await request(app.getHttpServer()).get(
//           `${route}/?page=1&pageSize=1`,
//         );
//         expect(response.statusCode).toBe(HttpStatus.OK);
//         expect(response.body.items).toBeDefined();
//         expect(response.body.items.length).toEqual(1);
//         expect(response.body.totalCount).toEqual(insertCount);
//       });

//       it('200 - should return an array with all inventories orderedBy availableQuantity', async () => {
//         const response = await request(app.getHttpServer()).get(
//           `${route}/?orderBy=availableQuantity`,
//         );
//         expect(response.statusCode).toBe(HttpStatus.OK);
//         expect(response.body.items).toBeDefined();
//         expect(response.body.items.length).toEqual(insertCount);
//         expect(response.body.totalCount).toEqual(insertCount);
//         expect(response.body.items[0].availableQuantity).toEqual(
//           lowestQuantity,
//         );
//       });

//       it('200 - should return an empty array when page is outside the bounds', async () => {
//         const response = await request(app.getHttpServer()).get(
//           `${route}?page=1000`,
//         );
//         expect(response.statusCode).toBe(HttpStatus.OK);
//         expect(response.body.items).toBeDefined();
//         expect(response.body.items.length).toEqual(0);
//         expect(response.body.totalCount).toEqual(insertCount);
//       });
//     });

//     describe('(GET) find', () => {
//       let id: string = '';
//       beforeAll(async () => {
//         const connection = await getConnection();
//         const entityManager = connection.createEntityManager();
//         entityManager.insert<Inventory>(Inventory, {
//           name: 'ChocolateCars',
//           manufactureDate: '2022-01-20',
//           availableQuantity: 3,
//         });
//         insertCount++;
//         const inventories = await request(app.getHttpServer()).get(route);
//         id = inventories.body.items[0].id;
//       });

//       it('200 - should return a single inventory item', async () => {
//         const response = await request(app.getHttpServer()).get(
//           `${route}/${id}`,
//         );
//         expect(response.statusCode).toBe(HttpStatus.OK);
//         expect(response.body).toBeDefined();
//         expect(response.body.name).toBeDefined();
//       });

//       it('404 - should fail when id is non existent', async () => {
//         const response = await request(app.getHttpServer()).get(`${route}/30`);
//         expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
//       });
//     });
//   });
// });
