import { applyDecorators, BadRequestException } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

class AuthResponse {
  @ApiProperty()
  access_token: string;
}

export const GetAuthDocs = () =>
  applyDecorators(
    ApiTags('auth'),
    ApiOperation({
      summary: 'Generate access token',
      description: 'Generate an access token for requests',
    }),
    ApiCreatedResponse({ type: AuthResponse }),
    ApiBadRequestResponse({
      description: new BadRequestException().message,
    }),
  );
