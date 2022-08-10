import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    username: String;

    @Prop()
    password: String;

    _id: any;
};

export const UserSchema = SchemaFactory.createForClass(User);
