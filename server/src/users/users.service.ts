import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(username: string, password: string) {
        // delete all users
        await this.userModel.deleteMany().exec();

        // encrypt the password
        password = await bcrypt.hash(password, 10);

        // create the user obj/document
        const user = new this.userModel({
            username,
            password
        });

        // save
        return await user.save();
    }

    async findOne(username: string): Promise<User | undefined> {
        let user: User = await this.userModel.findOne({ username }).exec();

        return user;
    }

    async findById(id: string) {
        return await this.userModel.findById(id).exec();
    }

    findAll() {
        return this.userModel.find().exec();
    }
}
