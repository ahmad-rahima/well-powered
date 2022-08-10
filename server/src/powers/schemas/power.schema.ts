import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type PowerDocument = Power & Document;

@Schema()
export class Power {
    @Prop() name: string;
    @Prop() unit: string;
    @Prop() color: string;
}

export const PowerSchema = SchemaFactory.createForClass(Power);
