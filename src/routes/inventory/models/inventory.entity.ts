import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class InventoryDTO {
  @ApiProperty()
  @Field()
  name: string;

  @ApiProperty()
  @Field()
  manufactureDate: Date;

  @ApiProperty()
  @Field()
  availableQuantity: number;
}

@ObjectType()
export class InventoryListResponse {
  @ApiProperty()
  @Field(() => [Inventory])
  items: Inventory[];

  @ApiProperty()
  @Field()
  totalCount: number;
}

@Entity()
@ObjectType()
export class Inventory implements InventoryDTO {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @ApiProperty()
  @Column()
  @Field()
  name: string;

  @ApiProperty()
  @Column()
  @Field()
  manufactureDate: Date;

  @ApiProperty()
  @Column()
  @Field()
  availableQuantity: number;
}

export const InventoryRequestSchema = Joi.object({
  name: Joi.string().required(),
  manufactureDate: Joi.date().required(),
  availableQuantity: Joi.number().required(),
}).options({
  abortEarly: false,
});
