import { Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GetAuthDocs } from './auth.controller.docs';
import { Public } from './decorators';

@Public()
@Controller('/auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Post('')
  @GetAuthDocs()
  async getToken() {
    const payload = { data: 'data' };
    return { access_token: this.jwtService.sign(payload) };
  }
}
