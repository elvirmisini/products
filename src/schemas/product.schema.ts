import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Product extends Document {
    @Prop({ default: true })
    ok: boolean;

    @Prop()
    docId: string;

    @Prop()
    fullData: string;
    
    @Prop({default:0})
    isDeleted: number;

    @Prop({ type: MongooseSchema.Types.Mixed }) 
    data: any;

    @Prop({ type: MongooseSchema.Types.Mixed }) 
    additionalFields: Record<string, any>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
