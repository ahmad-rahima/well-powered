import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    // async onModuleInit() {
    //     const username = 'admin';
    //     const password = await bcrypt.hash('admin', 10);

    //     const user = new this.userModel({
    //         username,
    //         password
    //     });
    //     await user.save();
    // }

    async create(username: string, password: string) {
        password = await bcrypt.hash(password, 10);

        const user = new this.userModel({
            username,
            password
        });
        console.log(user);
        await user.save();
    }

    findOne(username: string): Promise<User | undefined> {
        // return this.users.find(user => user.username === username);
        return this.userModel.findOne({ username }).exec();
    }
}
