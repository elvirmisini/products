
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { productModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductImportScheduler } from './utils/scheduler';
import { ProductsController } from './products/products.controllers';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [ConfigModule.forRoot(),MongooseModule.forRoot(process.env.MONGO_DB_URL),productModule,ScheduleModule.forRoot(),
],
  controllers: [AppController,ProductsController],
  providers: [AppService,ProductImportScheduler],
})
export class AppModule {}
