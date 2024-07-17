import { Controller, Get, Post, Body, Res, HttpStatus, Delete, Param, Put } from '@nestjs/common';
import {  updateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
   async import(@Res() res: Response):Promise<any> {
    try {
        const result = await this.productsService.importProducts();
        const formattedResult = Array.from(result.entries()).map(([key, value]) => ({
            "ok":true,
             data:value,
          }));
        await this.productsService.insertProducts(formattedResult)
        
        return  res.status(HttpStatus.OK).json(formattedResult);
      } catch (error) {
 
        throw error; 
      }
    

  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
        this.productsService.deleteProduct(id);

        return  {message:"Deleted SuccesFully"}
      } catch (error) {
        console.error(error);
        throw error; 
      }
  } 

  @Put(':id')
   update(@Param('id')id: string,@Body() updateProduct: updateProductDto)  {
    try {
        this.productsService.updateProduct(id,updateProduct);

        return  {message:"Updated Successfully"}
      } catch (error) {
        console.error(error);
        throw error; 
      }
  }
}