import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { Product, ProductSchema } from '../schemas/product.schema';
import * as nanoid from 'nanoid'
import { updateProductDto } from './dto/update-product.dto';
import { Variant } from './interfaces/variant';
import { Products } from './interfaces/product';



@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}
    async parseCSV(filePath: string): Promise<Products[]> {
        return new Promise((resolve, reject) => {
            const productsMap: { [key: string]: Products } = {};
        
            fs.createReadStream(filePath)
              .pipe(csv())
              .on('data', async (row) => {
                try {
                  const vendorId = await row.VendorID;
                  const manufacturerId = await row.ManufacturerID;
        
                  if (productsMap[row.ProductID]) {
                    productsMap[row.ProductID].data.variants.push(this.convertRowToVariant(row));
                  } else {
                    const newProduct = await this.convertRowToProduct(row, vendorId, manufacturerId);
                    productsMap[row.ProductID] = newProduct;
                  }
                } catch (error) {
                  console.error('Error processing row:', error);
                }
              })
              .on('end', () => {
                resolve(Object.values(productsMap));
              })
              .on('error', (error) => {
                reject(error);
              });
          });
        }

      convertRowToVariant(row: any): Variant {
        return {
            id: nanoid.nanoid(),
            available: row.QuantityOnHand > 0,
            attributes: {
              packaging: row.PKG,
              description: row.ItemDescription,
            },
            cost: parseFloat(row.UnitPrice),
            currency: "USD",
            depth: null,
            description: row.ItemDescription,
            dimensionUom: null,
            height: null,
            width: null,
            manufacturerItemCode: row.ManufacturerItemCode,
            manufacturerItemId: row.ManufacturerItemID,
            packaging: row.PKG,
            price: parseFloat(row.UnitPrice),
            volume: null,
            volumeUom: null,
            weight: null,
            weightUom: null,
            optionName: `${row.PKG}, ${row.ItemDescription}`,
            optionsPath: "bhggiv.pctgaf",
            optionItemsPath: "raaswx.cxuzfe",
            sku: `${row.ManufacturerItemID}${row.PKG}`,
            active: true,
            images: [{
              fileName: "",
              cdnLink: null,
              i: 0,
              alt: null,
            }],
            itemCode: `HSI ${row.ManufacturerItemCode}`,
          };
        }
      

      async convertRowToProduct(row: any, vendorId: string, manufacturerId: string): Promise<Products> {
        return {
            _id: new Types.ObjectId(),
            docId: nanoid.nanoid(),
            fullData: null,
            data: {
              name: row.ProductName,
              description: row.ProductDescription,
              vendorId: vendorId,
              manufacturerId: manufacturerId,
              storefrontPriceVisibility: "members-only",
              variants: [this.convertRowToVariant(row)],
              options: [
                {
                  id: "bhggiv",
                  name: "packaging",
                  dataField: null,
                  values: [
                    {
                      id: "raaswx",
                      name: row.PKG,
                      value: row.PKG,
                    },
                  ],
                },
                {
                  id: "pctgaf",
                  name: "description",
                  dataField: null,
                  values: [
                    {
                      id: "cxuzfe",
                      name: row.ItemDescription,
                      value: row.ItemDescription,
                    },
                  ],
                },
              ],
              availability: "available",
              isFragile: false,
              published: "published",
              isTaxable: true,
              images: [
                {
                  fileName: "medtech.png",
                  cdnLink: "https://template-b2b-commerce-business-logic-api-d8039-dev.global.ssl.fastly.net/public/company/2yTnVUyG6H9yRX3K1qIFIiRz/public/nao/productphotos/medtech.png",
                  i: 0,
                  alt: null,
                },
              ],
              categoryId: "U8YOybu1vbgQdbhSkrpmAYIV",
            },
          };
        }
      
    async importProducts(): Promise<any> {
      
      const csvFilePath = process.env.FILE_TO_IMPORT
      console.log(csvFilePath)
        const productMap = await this.parseCSV(csvFilePath);
        return productMap
        
    }

    async insertProducts(productsData: any[]): Promise<Product[]> {
        try {

            const validProducts = productsData.map(product => ({
                ok: product.ok ?? true, 
                data: {
                    ...product.data,
                    
                },
                docId: product.data.docId ?? '', 
                fullData: product.fullData ?? null, 
            }));

            const insertedProducts = await this.productModel.insertMany(validProducts);

            return insertedProducts;
        } catch (error) {
            console.error('Error inserting products:', error);
            throw error;
        }
    }

    async getProductsToEnhance(): Promise<Product[]> {
        return this.productModel.find({}).limit(10).exec();
    }

    async deleteProduct(id:string): Promise<any> {
        return await this.productModel.updateOne({docId:id},{isDeleted:1});
    }
    async updateProduct(id:string,body:updateProductDto): Promise<any> {
        return await this.productModel.updateOne(
    { docId: id },
    { $set: { 'data.data.description': body.description } }
  );

    }

}