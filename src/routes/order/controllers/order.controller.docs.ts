import { applyDecorators, BadRequestException } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Order } from '../models/order.entity';

export const CreateOrderDocs = () =>
  applyDecorators(
    ApiTags('order'),
    ApiOperation({
      summary: 'Create order',
      description: 'Create a new order',
    }),
    ApiCreatedResponse({ type: Order }),
    ApiBadRequestResponse({
      description: new BadRequestException().message,
    }),
  );

export const PatchOrderDocs = () =>
  applyDecorators(
    ApiTags('order'),
    ApiOperation({
      summary: 'Patch order',
      description: 'Patch an order status',
    }),
    ApiOkResponse({ type: Order }),
    ApiBadRequestResponse({
      description: new BadRequestException().message,
    }),
  );

export const GetOrderDocs = () =>
  applyDecorators(
    ApiTags('order'),
    ApiOperation({
      summary: 'Get order',
      description: 'Get an order',
    }),
    ApiOkResponse({ type: Order }),
    ApiBadRequestResponse({
      description: new BadRequestException().message,
    }),
  );

export const GetOrdersDocs = () =>
  applyDecorators(
    ApiTags('order'),
    ApiOperation({
      summary: 'Get orders',
      description: 'Get a list of orders',
    }),
    ApiOkResponse({ type: Order, isArray: true }),
    ApiBadRequestResponse({
      description: new BadRequestException().message,
    }),
  );
