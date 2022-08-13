import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subject } from 'rxjs';
import { Power, PowerDocument } from './schemas/power.schema';


@Injectable()
export class PowersService {
    updates = new Subject<Types.ObjectId>();
    toDelete = new Subject<Types.ObjectId>();

    constructor(@InjectModel(Power.name) private powerModel: Model<PowerDocument>) {
    }

    async create(power: Power): Promise<Power> {
        const createdPower = new this.powerModel(power);
        return createdPower.save();
    }

    async createIfUnique(power: Power) {
        let res = await this.powerModel.findOne({ name: power.name }).exec()
            .catch(err => console.log(err));
        if (res) return;

        return await this.create(power);
    }

    async findAllPowers() {
        return await this.powerModel.find().select('name').exec();
    }

    async getEverything() {
        return await this.powerModel.find().exec();
    }

    async findOne(powerId: Types.ObjectId) {
        return this.powerModel.findById(powerId).exec();
    }

    async findOneByName(name: string) {
        return this.powerModel.findOne({ name }).exec();
    }

    updateOne(powerId: Types.ObjectId, power: any) {
        this.powerModel.findByIdAndUpdate(powerId, power).exec()
        .then(_ => {
            this.updates.next(powerId);
        });
    }

    deleteOne(powerId: Types.ObjectId) {
        return this.powerModel.findByIdAndDelete(powerId).exec();
    }

    drop() {
        return this.powerModel.remove().exec();
    }
}
