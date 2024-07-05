import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { JoiValidationPipe } from '../../../validation/validation.pipe';
import {
  CreateOrderRequestSchema,
  UpdateOrderRequestSchema,
  CreateOrderDTO,
  UpdateOrderDTO,
  Order,
  OrderListResponse,
} from '../models/order.entity';
import { OrderPageOptionsDto } from '../../../validation/filters';
import {
  CreateOrderDocs,
  GetOrderDocs,
  GetOrdersDocs,
  PatchOrderDocs,
} from './order.controller.docs';
import { JwtGuard } from '../../auth/jwt.guard';

@Controller('/orders')
@UseGuards(JwtGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('')
  @CreateOrderDocs()
  @UsePipes(new JoiValidationPipe(CreateOrderRequestSchema))
  async create(@Body() body: CreateOrderDTO): Promise<Order> {
    return this.orderService.create(body);
  }

  @Get('')
  @GetOrdersDocs()
  async findAll(
    @Query() filter?: OrderPageOptionsDto,
  ): Promise<OrderListResponse> {
    return this.orderService.findAll(filter);
  }

  @Patch('/:id')
  @PatchOrderDocs()
  @UsePipes(new JoiValidationPipe(UpdateOrderRequestSchema))
  async patch(
    @Param() params: { id: string },
    @Body() body: UpdateOrderDTO,
  ): Promise<Order> {
    return this.orderService.patch(params.id, body);
  }

  @Get('/:id')
  @GetOrderDocs()
  async find(@Param() params: { id: string }): Promise<Order> {
    return this.orderService.find(params.id);
  }
}
