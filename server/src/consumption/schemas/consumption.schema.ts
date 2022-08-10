import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { College } from "../../colleges/schemas/college.schema";
import { Power } from "../../powers/schemas/power.schema";

export type ConsumptionDocument = Consumption & Document;

@Schema()
export class Consumption {
    @Prop() date: Date;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "College" })
    college: College;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Power" })
    power: Power;
    @Prop()
    amount: number;
}

export const ConsumptionSchema = SchemaFactory.createForClass(Consumption);
