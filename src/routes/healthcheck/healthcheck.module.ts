import { Module } from '@nestjs/common';

import { HealthCheckController } from './healthcheck.controller';

@Module({
    imports: [],
    controllers: [HealthCheckController],
})
export class HealthCheckModule {}
