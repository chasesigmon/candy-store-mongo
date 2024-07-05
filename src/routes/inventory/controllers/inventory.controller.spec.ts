import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { InventoryModule } from '../inventory.module';
import {
  Inventory,
  InventoryDocument,
  InventorySchema,
} from '../models/inventory.model';
import { InventoryController } from './inventory.controller';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../../../test-utils/utils';
import mongoose, { Connection, Model } from 'mongoose';
import { INestApplication } from '@nestjs/common';

describe('InventoryController', () => {
  let inventoryController: InventoryController;
  let firstRecordName = '';
  let db: Connection;
  let inventoryModel: Model<Inventory>;
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Inventory', schema: InventorySchema },
        ]),
        InventoryModule,
      ],
    }).compile();

    inventoryController = app.get<InventoryController>(InventoryController);

    inventoryModel = app.get<Model<Inventory>>(getModelToken(Inventory.name));
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
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
    });
  });

  describe('update()', () => {
    let inv;
    beforeAll(async () => {
      firstRecordName = 'ChocolateCars';
      inv = await new inventoryModel({
        name: 'ChocolateCars',
        manufactureDate: '2022-01-20',
        availableQuantity: 3,
      }).save();
    });

    it('should succeed and return with an updated inventory item', async () => {
      const inventory = {
        name: 'ChocolateCruisers',
        manufactureDate: new Date('2023-05-05'),
        availableQuantity: 30,
      };
      const result = await inventoryController.update(
        { id: inv.id },
        inventory,
      );
      expect(result).toBeDefined();
      expect(result.name).toEqual(inventory.name);
    });
  });

  //   describe('findAll()', () => {
  //     let connection;
  //     let entityManager: EntityManager;
  //     beforeAll(async () => {
  //       connection = await getConnection();
  //       entityManager = connection.createEntityManager();
  //       entityManager.insert<Inventory>(Inventory, {
  //         name: 'ChocolateRVs',
  //         manufactureDate: '2022-01-20',
  //         availableQuantity: 3,
  //       });
  //     });

  //     it('should succeed and return with an array of inventories', async () => {
  //       const result = await inventoryController.findAll();
  //       expect(result.items).toBeDefined();
  //     });
  //   });

  //   describe('find()', () => {
  //     it('should succeed and return with an inventory item', async () => {
  //       const inventory = await inventoryController.findAll();
  //       const id = inventory.items[0].id.toString();
  //       const result = await inventoryController.find({ id });
  //       expect(result).toBeDefined();
  //       expect(result.name).toEqual(firstRecordName);
  //     });
  //   });
});
