import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StoreController } from './controllers/store.controller';
import { StoreService } from './services/store.service';
import { Store } from './models/store.entity';
import { StoreRepository } from './repositories/store.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [StoreController],
  providers: [StoreService, StoreRepository],
  exports: [StoreService, StoreRepository],
})
export class StoreModule {}
