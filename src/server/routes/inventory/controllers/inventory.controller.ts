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
import { InventoryService } from '../services/inventory.service';
import { JoiValidationPipe } from '../../../validation/validation.pipe';
import {
  InventoryRequestSchema,
  InventoryDTO,
  Inventory,
  InventoryListResponse,
  InventoryDocument,
} from '../models/inventory.model';
import { GenericPageOptionsDto } from '../../../validation/filters';
import {
  CreateInventoryDocs,
  GetInventoriesDocs,
  GetInventoryDocs,
  UpdateInventoryDocs,
} from './inventory.controller.docs';
import { JwtGuard } from '../../auth/jwt.guard';

@Controller('/inventories')
@UseGuards(JwtGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('')
  @CreateInventoryDocs()
  @UsePipes(new JoiValidationPipe(InventoryRequestSchema))
  async create(@Body() body: InventoryDTO): Promise<InventoryDocument> {
    return this.inventoryService.create(body);
  }

  @Get('')
  @GetInventoriesDocs()
  async findAll(
    @Query() filter?: GenericPageOptionsDto,
  ): Promise<InventoryDocument[]> {
    return this.inventoryService.findAll(filter);
  }

  @Put('/:id')
  @UpdateInventoryDocs()
  @UsePipes(new JoiValidationPipe(InventoryRequestSchema))
  async update(
    @Param() params: { id: string },
    @Body() body: InventoryDTO,
  ): Promise<InventoryDocument> {
    const result = await this.inventoryService.update(params.id, body);
    return result;
  }

  @Get('/:id')
  @GetInventoryDocs()
  async find(@Param() params: { id: string }): Promise<InventoryDocument> {
    return this.inventoryService.find(params.id);
  }
}
