import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InventoryRepository } from '../../inventory/repositories/inventory.repository';
import { OrderPageOptionsDto } from '../../../validation/filters';
import {
  CreateOrderDTO,
  UpdateOrderDTO,
  OrderListResponse,
  Order,
  StatusEnum,
} from '../models/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { CustomerRepository } from '../../customer/repositories/customer.repository';
import { StoreRepository } from '../../store/repositories/store.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly inventoryRepository: InventoryRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly storeRepository: StoreRepository,
  ) {}

  async create(body: CreateOrderDTO): Promise<Order> {
    const inventory = await this.inventoryRepository.find(body.inventoryId);

    if (!inventory) {
      throw new NotFoundException(
        `Inventory item with id ${body.inventoryId} does not exist.`,
      );
    }

    if (inventory.availableQuantity < body.quantity) {
      throw new BadRequestException(
        `Inventory ${inventory.name} does not have the available quantity for the order.`,
      );
    }

    const customer = await this.customerRepository.find(body.customerId);

    if (!customer) {
      throw new NotFoundException(
        `Customer item with id ${body.customerId} does not exist.`,
      );
    }

    const store = await this.storeRepository.find(body.storeId);

    if (!store) {
      throw new NotFoundException(
        `Store item with id ${body.storeId} does not exist.`,
      );
    }

    await this.inventoryRepository.update(inventory.id, {
      ...inventory,
      availableQuantity: inventory.availableQuantity - body.quantity,
    });

    return await this.orderRepository.create(body);
  }

  async findAll(
    @Query() filter?: OrderPageOptionsDto,
  ): Promise<OrderListResponse> {
    const result = await this.orderRepository.findAll(filter);
    return {
      items: result[0],
      totalCount: result[1],
    };
  }

  async patch(id: string, body: UpdateOrderDTO): Promise<Order> {
    const order = await this.find(id);

    // If the order is cancelled then return the quantity to the inventory
    if (body.status === StatusEnum.CANCELLED) {
      const inventory = await this.inventoryRepository.find(order.inventoryId);
      await this.inventoryRepository.update(order.inventoryId, {
        ...inventory,
        availableQuantity: inventory.availableQuantity + order.quantity,
      });
    }

    return await this.orderRepository.patch(id, body);
  }

  async find(id: string): Promise<Order> {
    const result = await this.orderRepository.find(id);

    if (!result) {
      throw new NotFoundException(`Could not find Order item with id: ${id}`);
    }

    return result;
  }

  async report() {
    return this.orderRepository.report();
  }

  async seed() {
    const orders = await this.findAll();
    if (!orders.items.length) {
      const [x, y, z] = await Promise.all([
        this.customerRepository.findAll(),
        this.inventoryRepository.findAll(),
        this.storeRepository.findAll(),
      ]);
      const customers = x[0],
        inventories = y[0],
        stores = z[0];
      await this.orderRepository.create({
        customerId: customers[0].id,
        inventoryId: inventories[0].id,
        storeId: stores[0].id,
        quantity: 10,
      });
      await this.orderRepository.create({
        customerId: customers[1].id,
        inventoryId: inventories[1].id,
        storeId: stores[1].id,
        quantity: 5,
      });
      await this.orderRepository.create({
        customerId: customers[2].id,
        inventoryId: inventories[2].id,
        storeId: stores[1].id,
        quantity: 8,
      });
      await this.orderRepository.create({
        customerId: customers[2].id,
        inventoryId: inventories[2].id,
        storeId: stores[2].id,
        quantity: 12,
      });
      await this.orderRepository.create({
        customerId: customers[3].id,
        inventoryId: inventories[3].id,
        storeId: stores[3].id,
        quantity: 4,
      });
      await this.orderRepository.create({
        customerId: customers[5].id,
        inventoryId: inventories[5].id,
        storeId: stores[5].id,
        quantity: 1,
      });
      await this.orderRepository.create({
        customerId: customers[1].id,
        inventoryId: inventories[1].id,
        storeId: stores[5].id,
        quantity: 20,
      });
    }
  }
}
