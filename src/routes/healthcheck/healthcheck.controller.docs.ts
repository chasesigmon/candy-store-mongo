import {
  applyDecorators,
  BadRequestException,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { HealthCheckResponse } from './healthcheck.model';

export const GetHealthcheckDocs = () =>
  applyDecorators(
    Version(VERSION_NEUTRAL),
    ApiTags('healthcheck'),
    ApiOperation({
      summary: 'Healthcheck',
      description: 'Check the health of the Candy Store API.',
    }),
    ApiOkResponse({ type: HealthCheckResponse }),
    ApiBadRequestResponse({
      description: new BadRequestException().message,
    }),
  );
