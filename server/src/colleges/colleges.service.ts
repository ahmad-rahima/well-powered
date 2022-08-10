import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subject } from 'rxjs';
import { College, CollegeDocument } from './schemas/college.schema';

@Injectable()
export class CollegesService {
    constructor(
        @InjectModel(College.name) private collegeModel: Model<CollegeDocument>,
    ) {
    }

    updates = new Subject<Types.ObjectId>();
    deletes = new Subject<Types.ObjectId>();

    async create(college: College): Promise<College> {
        const createdCollege = new this.collegeModel(college);
        return createdCollege.save();
    }

    async findAllColleges() {
        return await this.collegeModel.find().select('name').exec();
    }

    async findOne(collegeId: Types.ObjectId) {
        return await this.collegeModel.findById(collegeId).exec();
    }

    async updateOne(collegeId: Types.ObjectId, college: College) {
        await this.collegeModel.findByIdAndUpdate(collegeId, college);
        this.updates.next(collegeId);
    }

    async deleteOne(collegeId: Types.ObjectId) {
        await this.collegeModel.findByIdAndDelete(collegeId).exec();
        this.deletes.next(collegeId);
    }
}
