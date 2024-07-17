import { Module } from '@nestjs/common';
import { ProductsController } from './products.controllers';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema,  } from '../schemas/product.schema';

@Module({
imports:[MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class productModule {}