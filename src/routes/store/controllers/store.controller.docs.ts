import { applyDecorators, BadRequestException } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Store } from '../models/store.entity';

export const CreateStoreDocs = () =>
  applyDecorators(
    ApiTags('store'),
    ApiOperation({
      summary: 'Create store',
      description: 'Create a new store',
    }),
    ApiCreatedResponse({ type: Store }),
    ApiBadRequestResponse({
      description: new BadRequestException().message,
    }),
  );

export const UpdateStoreDocs = () =>
  applyDecorators(
    ApiTags('store'),
    ApiOperation({
      summary: 'Update store',
      description: 'Update a store',
    }),
    ApiOkResponse({ type: Store }),
    ApiBadRequestResponse({
      description: new BadRequestException().message,
    }),
  );

export const GetStoreDocs = () =>
  applyDecorators(
    ApiTags('store'),
    ApiOperation({
      summary: 'Get store',
      description: 'Get a store',
    }),
    ApiOkResponse({ type: Store }),
    ApiBadRequestResponse({
      description: new BadRequestException().message,
    }),
  );

export const GetStoresDocs = () =>
  applyDecorators(
    ApiTags('store'),
    ApiOperation({
      summary: 'Get stores',
      description: 'Get a list of stores',
    }),
    ApiOkResponse({ type: Store, isArray: true }),
    ApiBadRequestResponse({
      description: new BadRequestException().message,
    }),
  );
