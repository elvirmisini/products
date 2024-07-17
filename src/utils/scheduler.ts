import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProductsService } from '../products/products.service';
import axios from 'axios';

@Injectable()
export class ProductImportScheduler {
    constructor(private productService: ProductsService) {}

    @Cron('0 0 * * *') 
    async handleCron() {
        console.log('Got in the scheduler-1')
        try {
            const result = await this.productService.importProducts();
            const formattedResult = Array.from(result.entries()).map(([key, value]) => ({
                "ok":true,
                 data:value,
              }));
            await this.productService.insertProducts(formattedResult)
            
            
          } catch (error) {
            console.error(error);
            throw error; 
          }
    
        await this.enhanceProductDescriptions();
    }

    private async enhanceProductDescriptions(): Promise<void> {
        const products = await this.productService.getProductsToEnhance(); 
        for (const product of products.slice(0, 10)) {
            const enhancedDescription = await this.getEnhancedDescription(product);
            await this.productService.updateProduct(product.docId, {description:`test   ${enhancedDescription}`});
        }
    }

    private async getEnhancedDescription(product: any): Promise<string> {
        const url = process.env.CHAT_GBT_URL;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CHAT_GBT_API_KEY}`
        };
        const prompt = `
        You are an expert in medical sales. Your specialty is medical consumables used by hospitals on a daily basis. Your task is to enhance the description of a product based on the information provided.

        Product name: ${product.data.data.name}
        Product description: ${product.data.data.description}
        Category: 

        New Description:
        `;
        const data = {
            model: `${process.env.CHAT_GBT_MODEL}`,
            messages: [
            { role: 'system', content: '' },
            { role: 'user', content: prompt }
            ]
        };

        try {
            const response = await axios.post(url, data, { headers });
            const completion = response.data.choices[0].message.content;
            console.log('Enhanced Description:', completion);
            return completion
        } catch (error) {
            console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
        }
    }
}
