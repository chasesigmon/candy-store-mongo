import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class StoreDTO {
  @ApiProperty()
  public address: string;

  @ApiProperty()
  public managerName: string;
}

export class StoreListResponse {
  @ApiProperty()
  items: Store[];

  @ApiProperty()
  totalCount: number;
}

@Entity()
export class Store implements StoreDTO {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  address: string;

  @ApiProperty()
  @Column()
  managerName: string;
}

export const StoreRequestSchema = Joi.object({
  address: Joi.string().required(),
  managerName: Joi.string().required(),
}).options({
  abortEarly: false,
});
