import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Order } from '../../order/models/order.entity';
import { JwtGuard } from '../../auth/jwt.guard';
import { OrderService } from '../../order/services/order.service';
import { GetReportDocs } from './report.controller.docs';

@Controller('/report')
@UseGuards(JwtGuard)
export class ReportController {
  constructor(private readonly orderService: OrderService) {}

  @Get('')
  @GetReportDocs()
  async report(): Promise<Order[]> {
    return this.orderService.report();
  }
}
