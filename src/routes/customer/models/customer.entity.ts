import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerDTO {
  @ApiProperty()
  name: string;
}

export class CustomerListResponse {
  @ApiProperty()
  items: Customer[];

  @ApiProperty()
  totalCount: number;
}

@Entity()
export class Customer implements CustomerDTO {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;
}

export const CustomerRequestSchema = Joi.object({
  name: Joi.string().required(),
}).options({
  abortEarly: false,
});
