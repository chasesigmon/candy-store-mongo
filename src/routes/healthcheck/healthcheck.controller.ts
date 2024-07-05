import { Controller, Get, SetMetadata, VERSION_NEUTRAL } from '@nestjs/common';
import { Public } from '../auth/decorators';

import { GetHealthcheckDocs } from './healthcheck.controller.docs';
import { HealthCheckResponse } from './healthcheck.model';

@Controller('/healthcheck')
@Public()
export class HealthCheckController {
  constructor() {}

  @Get()
  @GetHealthcheckDocs()
  healthcheck(): HealthCheckResponse {
    return {
      Date: Date.now(),
      Status: 'OK',
      ResponseType: 'HealthCheckResponse',
    };
  }
}
