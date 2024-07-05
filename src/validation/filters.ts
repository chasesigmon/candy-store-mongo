import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsEnum, Min, IsInt, Max } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  orderBy?: string;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  pageSize?: number = 10;
}

export class GenericPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Can filter by "name". ex: `?filter={ "name": "John" }`',
  })
  @IsOptional()
  filter?: string;
}

export class StorePageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description:
      'Can filter by "managerName". ex: `?filter={ "managerName": "John" }`',
  })
  @IsOptional()
  filter?: string;
}

export class OrderPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description:
      'Can filter by "customerId, inventoryId, storeId, and status". ex: `?filter={ "status": "PENDING/CANCELLED/DELIVERED" }`',
  })
  @IsOptional()
  filter?: string;
}

export const formatFilter = (filter?: PageOptionsDto) => {
  let formattedFilter: any = {};
  const page = filter?.page ? parseInt(filter.page.toString()) : 1;
  const pageSize = filter?.pageSize ? parseInt(filter.pageSize.toString()) : 10;

  formattedFilter.skip = (page - 1) * pageSize;
  formattedFilter.take = pageSize;

  if (filter?.orderBy) {
    formattedFilter.order = {
      [filter.orderBy]: filter?.sortOrder || SortOrder.ASC,
    };
  } else {
    formattedFilter.order = { ['id']: SortOrder.ASC };
  }

  return formattedFilter;
};

export const checkNameFilter = (
  field: string,
  filter?: GenericPageOptionsDto,
  formattedFilter?: any,
) => {
  if (filter?.filter) {
    try {
      const parsed = JSON.parse(filter.filter);
      parsed.name && (formattedFilter.where = { [field]: parsed.name });
    } catch (err) {
      // catch and disregard error if invalid JSON was passed in
    }
  }
  return formattedFilter;
};
