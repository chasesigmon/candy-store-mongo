import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { InventoryModule } from '../src/routes/inventory/inventory.module';
import {
  Inventory,
  InventorySchema,
} from '../src/routes/inventory/models/inventory.model';
import { JwtGuard } from '../src/routes/auth/jwt.guard';
import {
  closeInMongodConnection,
  JwtGuardMock,
  rootMongooseTestModule,
} from '../test-utils/utils';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('InventoryController (e2e)', () => {
  let app: INestApplication;
  let inventoryModel: Model<Inventory>;
  const ID = '668834b2f940005a6e173d47';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Inventory', schema: InventorySchema },
        ]),
        InventoryModule,
      ],
    })
      .overrideGuard(JwtGuard)
      .useClass(JwtGuardMock)
      .compile();

    inventoryModel = moduleFixture.get<Model<Inventory>>(
      getModelToken(Inventory.name),
    );

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
  });

  const route = '/inventories';

  describe(route, () => {
    let insertCount = 0;
    describe('(POST) create', () => {
      it('201 - should return a newly created inventory item', async () => {
        const inventory = {
          name: 'ChocolateCars',
          manufactureDate: '2021-05-05',
          availableQuantity: 20,
        };
        const response = await request(app.getHttpServer())
          .post(route)
          .send(inventory);
        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body.name).toEqual(inventory.name);
        insertCount++;
      });

      it('400 - should fail with a missing property', async () => {
        const inventory = {
          name: 'ChocolateCars',
          manufactureDate: '2021-05-05',
        };
        const response = await request(app.getHttpServer())
          .post(route)
          .send(inventory);
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });

      it('400 - should fail with an invalid property', async () => {
        const inventory = {
          name: 'ChocolateCars',
          manufactureDate: 'test',
          availableQuantity: 20,
        };
        const response = await request(app.getHttpServer())
          .post(route)
          .send(inventory);
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    describe('(PUT) update', () => {
      let id = '';
      beforeAll(async () => {
        await new inventoryModel({
          name: 'ChocolateCars',
          manufactureDate: '2022-01-20',
          availableQuantity: 3,
        }).save();
        insertCount++;
        const inventories = await request(app.getHttpServer()).get(route);
        id = inventories.body[0]._id;
      });
      it('200 - should return an updated inventory item', async () => {
        const inventory = {
          name: 'ChocolateCruisers',
          manufactureDate: '2022-01-20',
          availableQuantity: 30,
        };
        const response = await request(app.getHttpServer())
          .put(`${route}/${id}`)
          .send(inventory);
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.name).toEqual(inventory.name);
      });

      it('400 - should fail with a missing property', async () => {
        const inventory = {
          name: 'ChocolateCars',
          manufactureDate: '2021-05-05',
        };
        const response = await request(app.getHttpServer())
          .put(`${route}/${id}`)
          .send(inventory);
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });

      it('404 - should fail when id is non existent', async () => {
        const inventory = {
          name: 'ChocolateCars',
          manufactureDate: '2021-05-05',
          availableQuantity: 20,
        };
        const response = await request(app.getHttpServer())
          .put(`${route}/${ID}`)
          .send(inventory);
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      });

      it('400 - should fail with an invalid property value', async () => {
        const inventory = {
          name: 'ChocolateCars',
          manufactureDate: 'test',
          availableQuantity: 20,
        };
        const response = await request(app.getHttpServer())
          .put(`${route}/${id}`)
          .send(inventory);
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    describe('(GET) findAll', () => {
      const lowestQuantity = 3;
      beforeAll(async () => {
        await new inventoryModel({
          name: 'ChocolateCruisers',
          manufactureDate: '2022-01-20',
          availableQuantity: lowestQuantity,
        }).save();
        await new inventoryModel({
          name: 'TaffyVehicles',
          manufactureDate: '2022-06-20',
          availableQuantity: 15,
        }).save();
        await new inventoryModel({
          name: 'CandyPopCars',
          manufactureDate: '2023-01-20',
          availableQuantity: 20,
        }).save();
        insertCount += 3;
      });

      it('200 - should return an array with all inventories', async () => {
        const response = await request(app.getHttpServer()).get(route);
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toBeDefined();
        expect(response.body.length).toEqual(insertCount);
      });

      //   it('200 - should return an array with 1 inventories when given pageSize=1', async () => {
      //     const response = await request(app.getHttpServer()).get(
      //       `${route}/?pageSize=1`,
      //     );
      //     expect(response.statusCode).toBe(HttpStatus.OK);
      //     expect(response.body).toBeDefined();
      //     expect(response.body.length).toEqual(1);
      //   });

      //   it('200 - should return an array with 1 inventories when given page=1 & pageSize=1', async () => {
      //     const response = await request(app.getHttpServer()).get(
      //       `${route}/?page=1&pageSize=1`,
      //     );
      //     expect(response.statusCode).toBe(HttpStatus.OK);
      //     expect(response.body).toBeDefined();
      //     expect(response.body.length).toEqual(1);
      //   });

      //   it('200 - should return an array with all inventories orderedBy availableQuantity', async () => {
      //     const response = await request(app.getHttpServer()).get(
      //       `${route}/?orderBy=availableQuantity`,
      //     );
      //     expect(response.statusCode).toBe(HttpStatus.OK);
      //     expect(response.body).toBeDefined();
      //     expect(response.body.length).toEqual(insertCount);
      //     expect(response.body[0].availableQuantity).toEqual(lowestQuantity);
      //   });

      //   it('200 - should return an empty array when page is outside the bounds', async () => {
      //     const response = await request(app.getHttpServer()).get(
      //       `${route}?page=1000`,
      //     );
      //     expect(response.statusCode).toBe(HttpStatus.OK);
      //     expect(response.body).toBeDefined();
      //     expect(response.body.length).toEqual(0);
      //   });
    });

    describe('(GET) find', () => {
      let id = '';
      beforeAll(async () => {
        await new inventoryModel({
          name: 'ChocolateCars',
          manufactureDate: '2022-01-20',
          availableQuantity: 3,
        }).save();
        insertCount++;
        const inventories = await request(app.getHttpServer()).get(route);
        id = inventories.body[0]._id;
      });

      it('200 - should return a single inventory item', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/${id}`,
        );
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toBeDefined();
        expect(response.body.name).toBeDefined();
      });

      it('404 - should fail when id is non existent', async () => {
        const response = await request(app.getHttpServer()).get(
          `${route}/${ID}`,
        );
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      });
    });
  });
});
