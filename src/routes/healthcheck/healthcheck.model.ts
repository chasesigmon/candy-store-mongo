import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponse {
    @ApiProperty({
        example: 1686661487184,
    })
    Date: number;

    @ApiProperty({
        example: HttpStatus[HttpStatus.OK],
    })
    Status: string;

    @ApiProperty({
        example: 'HealthCheckResponse',
    })
    ResponseType: string;
}
