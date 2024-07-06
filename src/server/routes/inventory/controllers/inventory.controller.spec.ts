import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { InventoryModule } from '../inventory.module';
import { Inventory, InventorySchema } from '../models/inventory.model';
import { InventoryController } from './inventory.controller';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../../../test-utils/utils';
import { Model } from 'mongoose';

describe('InventoryController', () => {
  let inventoryController: InventoryController;
  let inventoryModel: Model<Inventory>;
  let app: TestingModule;
  let inv;
  const updateName = 'ChocolateCruisers';

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

    inv = await new inventoryModel({
      name: 'ChocolateCars',
      manufactureDate: '2022-01-20',
      availableQuantity: 3,
    }).save();
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
    it('should succeed and return with an updated inventory item', async () => {
      const inventory = {
        name: updateName,
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

  describe('findAll()', () => {
    it('should succeed and return with an array of inventories', async () => {
      const result = await inventoryController.findAll();
      expect(result).toBeDefined();
      expect(result.length).toEqual(2);
    });
  });

  describe('find()', () => {
    it('should succeed and return with an inventory item', async () => {
      const result = await inventoryController.find({ id: inv.id });
      expect(result).toBeDefined();
      expect(result.name).toEqual(updateName);
    });
  });
});
