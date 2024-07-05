import { applyDecorators, BadRequestException } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Order } from '../../order/models/order.entity';

export const GetReportDocs = () =>
  applyDecorators(
    ApiTags('report'),
    ApiOperation({
      summary: 'Get orders report',
      description: 'Get a monthly report of orders',
    }),
    ApiOkResponse({ type: Order, isArray: true }),
    ApiBadRequestResponse({
      description: new BadRequestException().message,
    }),
  );
