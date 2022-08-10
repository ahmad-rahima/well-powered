import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { College } from '../../colleges/schemas/college.schema';
import { Power } from '../../powers/schemas/power.schema';

export type CollegePowerDocument = CollegePower & Document;

@Schema()
export class CollegePower {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'College' })
    college: College;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Power' })
    power: Power;

    @Prop({ default: 'true' }) active: boolean;

    @Prop() minSpan: number;
    @Prop() maxSpan: number;

    @Prop() minAmt: number;
    @Prop() maxAmt: number;

    @Prop() warn: number;
    @Prop() err: number;
}

export const CollegePowerSchema = SchemaFactory.createForClass(CollegePower);
