import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { StoreService } from '../services/store.service';
import { JoiValidationPipe } from '../../../validation/validation.pipe';
import {
  StoreRequestSchema,
  StoreDTO,
  Store,
  StoreListResponse,
} from '../models/store.entity';
import { PageOptionsDto } from '../../../validation/filters';
import {
  CreateStoreDocs,
  GetStoreDocs,
  GetStoresDocs,
  UpdateStoreDocs,
} from './store.controller.docs';
import { JwtGuard } from '../../auth/jwt.guard';

@Controller('/stores')
@UseGuards(JwtGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('')
  @CreateStoreDocs()
  @UsePipes(new JoiValidationPipe(StoreRequestSchema))
  async create(@Body() body: StoreDTO): Promise<Store> {
    return this.storeService.create(body);
  }

  @Get('')
  @GetStoresDocs()
  async findAll(@Query() filter?: PageOptionsDto): Promise<StoreListResponse> {
    return this.storeService.findAll(filter);
  }

  @Put('/:id')
  @UpdateStoreDocs()
  @UsePipes(new JoiValidationPipe(StoreRequestSchema))
  async update(
    @Param() params: { id: string },
    @Body() body: StoreDTO,
  ): Promise<Store> {
    return this.storeService.update(params.id, body);
  }

  @Get('/:id')
  @GetStoreDocs()
  async find(@Param() params: { id: string }): Promise<Store> {
    return this.storeService.find(params.id);
  }
}
