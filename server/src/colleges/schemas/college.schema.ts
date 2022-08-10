import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type CollegeDocument = College & Document;

@Schema()
export class College {
    @Prop() name: string;
    @Prop() description: string;
    @Prop() email: string;
}

export const CollegeSchema = SchemaFactory.createForClass(College);
