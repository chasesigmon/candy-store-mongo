import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export enum StatusEnum {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
}

export class CreateOrderDTO {
  @ApiProperty()
  customerId: number;

  @ApiProperty()
  inventoryId: number;

  @ApiProperty()
  storeId: number;

  @ApiProperty()
  quantity: number;
}

export class UpdateOrderDTO {
  @ApiProperty()
  status: StatusEnum;
}

export class OrderListResponse {
  @ApiProperty()
  items: Order[];

  @ApiProperty()
  totalCount: number;
}

@Entity()
export class Order implements CreateOrderDTO, UpdateOrderDTO {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  customerId: number;

  @ApiProperty()
  @Column()
  inventoryId: number;

  @ApiProperty()
  @Column()
  storeId: number;

  @ApiProperty()
  @Column()
  quantity: number;

  @ApiProperty()
  @Column({ nullable: true })
  status: StatusEnum;

  @ApiProperty()
  @Column({ nullable: true })
  createDate: Date;

  @ApiProperty()
  @Column({ nullable: true })
  updateDate: Date;
}

export const CreateOrderRequestSchema = Joi.object({
  customerId: Joi.number().required(),
  inventoryId: Joi.number().required(),
  storeId: Joi.number().required(),
  quantity: Joi.number().required(),
}).options({
  abortEarly: false,
});

export const UpdateOrderRequestSchema = Joi.object({
  status: Joi.string().required(),
}).options({
  abortEarly: false,
});
