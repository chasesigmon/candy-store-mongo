import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { InventoryModule } from './routes/inventory/inventory.module';
import { HealthCheckModule } from './routes/healthcheck/healthcheck.module';
import { CustomerModule } from './routes/customer/customer.module';
import { StoreModule } from './routes/store/store.module';
import { OrderModule } from './routes/order/order.module';
import { ReportModule } from './routes/report/report.module';
import { SeederModule } from './database/seeder.module';
import { AuthModule } from './routes/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './routes/auth/jwt.guard';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), '/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      path: '/candy-store',
    }),
    DatabaseModule,
    HealthCheckModule,
    InventoryModule,
    CustomerModule,
    StoreModule,
    OrderModule,
    ReportModule,
    SeederModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
