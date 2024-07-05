import { applyDecorators, BadRequestException } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Customer } from '../models/customer.entity';

export const CreateCustomerDocs = () =>
  applyDecorators(
    ApiTags('customer'),
    ApiOperation({
      summary: 'Create customer',
      description: 'Create a new customer',
    }),
    ApiCreatedResponse({ type: Customer }),
    ApiBadRequestResponse({
      description: new BadRequestException().message,
    }),
  );

export const UpdateCustomerDocs = () =>
  applyDecorators(
    ApiTags('customer'),
    ApiOperation({
      summary: 'Update customer',
      description: 'Update a customer',
    }),
    ApiOkResponse({ type: Customer }),
    ApiBadRequestResponse({
      description: new BadRequestException().message,
    }),
  );

export const GetCustomerDocs = () =>
  applyDecorators(
    ApiTags('customer'),
    ApiOperation({
      summary: 'Get customer',
      description: 'Get a customer',
    }),
    ApiOkResponse({ type: Customer }),
    ApiBadRequestResponse({
      description: new BadRequestException().message,
    }),
  );

export const GetCustomersDocs = () =>
  applyDecorators(
    ApiTags('customer'),
    ApiOperation({
      summary: 'Get customers',
      description: 'Get a list of customer',
    }),
    ApiOkResponse({ type: Customer, isArray: true }),
    ApiBadRequestResponse({
      description: new BadRequestException().message,
    }),
  );
