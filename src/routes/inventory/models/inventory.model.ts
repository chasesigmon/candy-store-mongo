import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class InventoryDTO {
  @ApiProperty()
  @Field(() => String)
  id?: String;

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

export const InventoryRequestSchema = Joi.object({
  name: Joi.string().required(),
  manufactureDate: Joi.date().required(),
  availableQuantity: Joi.number().required(),
}).options({
  abortEarly: false,
});

export type InventoryDocument = Inventory & Document;

@Schema({
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
})
@ObjectType()
export class Inventory {
  @Field()
  id: String;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true })
  @Field()
  manufactureDate: Date;

  @Prop({ required: true })
  @Field()
  availableQuantity: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
