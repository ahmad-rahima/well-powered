import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CollegeDto } from '../colleges/dto/college.dto';
import { College } from '../colleges/schemas/college.schema';
import { PowersService } from '../powers/powers.service';
import { CollegesService } from '../colleges/colleges.service';
import { CollegePower, CollegePowerDocument } from './schemas/college-power.schema';
import { Subject } from 'rxjs';
import { ConsumptionService } from 'src/consumption/consumption.service';


@Injectable()
export class CollegesPowersService {
    updates = new Subject<Types.ObjectId>();

    constructor(
        @InjectModel(CollegePower.name) private cpModel: Model<CollegePowerDocument>,
        private collegesService: CollegesService,
        private powersService: PowersService,
        private consumptionService: ConsumptionService
    ) {}

    async create(collegepower: CollegePower): Promise<CollegePower> {
        let createCp = new this.cpModel(collegepower);
        return createCp.save();
    }

    async getEverything() {
        return await this.cpModel.find().exec();
    }

    async getEverythingByNames() {
        return await this.cpModel.find()
            .populate('college')
            .populate('power')
            .exec();
    }

    async findByNamesByCollege(collegeId: Types.ObjectId) {
        return await this.cpModel.find({ college: collegeId })
            .populate('college')
            .populate('power')
            .exec();
    }

    async findAllColleges() {
        return await this.collegesService.findAllColleges();
    }

    async findAllByCollege(collegeId: Types.ObjectId) {
        return await this.cpModel.find({ college: collegeId }).exec();
    }

    async findPowersByCollege(collegeId: Types.ObjectId) {
        try {
            let powers: any = await this.cpModel.find({ college: collegeId })
                .populate('power')
                .select('power active')
                .exec();

            let ret = [];
            for (let { power, active } of powers)
                ret.push({ name: power.name, _id: power._id, active });
            return ret;
        } catch (err) {
            console.log(`ConsumptionService.findAll failed: ${err}`);
            return [{}];
        }
    }

    async findCollegesByPower(powerId: Types.ObjectId) {
        try {
            let colleges = await this.cpModel.find({ power: powerId })
                .populate('college')
                .select('college')
                .exec();

            let ret = [];
            for (let { college } of colleges)
                ret.push(college);
            return ret;
        } catch (err) {
            console.log(`ConsumptionService.findAll failed: ${err}`);
            return [{}];
        }
    }

    async findOneAsCollegeDTO(collegeId: Types.ObjectId) {
        let college = await this.collegesService.findOne(collegeId);
        let assoc = await this.cpModel.find({ college: collegeId })
            .populate('power').exec();

        let powerDtos = [];
        for (let a of assoc) {
            const { minSpan, maxSpan, minAmt, maxAmt, warn, err, active } = a;
            powerDtos.push({
                name: a.power.name,
                minSpan, maxSpan,
                minAmt, maxAmt,
                warn, err,
                active
            });
        }

        let collegeDto = new CollegeDto();
        for (let p in collegeDto)
            collegeDto[p] = college[p];
        collegeDto.powers = powerDtos;

        return collegeDto;
    }

    async updateCollegeDTO(collegeId: Types.ObjectId, collegeDto: CollegeDto) {
        let powers = collegeDto.powers;
        delete collegeDto.powers; // powers not in collegeModel, so delete it

        this.collegesService.updateOne(collegeId, <College>collegeDto);

        for (let p of powers) {
            let { _id: powerId } = await this.powersService.findOneByName(p.name);
            delete p.name;      // power name not in cpModel, so delete it
            let cp = {
                ...p,
                college: collegeId,
                power: powerId
            };
            // await this.cpModel.findOneAndUpdate({ college: collegeId, power: powerId }, cp);

            await this.cpModel.findOneAndUpdate({ college: collegeId, power: powerId }, cp) ||
                await (new this.cpModel(cp)).save();
        }

        this.updates.next(collegeId);
    }

    async addCollegeDto(collegeDto: CollegeDto) {
        let powers = collegeDto.powers;
        delete collegeDto.powers; // powers not in collegeModel, so delete it

        let college: any = await this.collegesService.create(<College>collegeDto);
        const collegeId = college._id;

        for (let p of powers) {
            let { _id: powerId } = await this.powersService.findOneByName(p.name);
            delete p.name;      // power name not in cpModel, so delete it
            let cp = {
                ...p,
                college: collegeId,
                power: powerId
            };

            // await this.cpModel.findOneAndUpdate({ college: collegeId, power: powerId }, cp) ||
            await (new this.cpModel(cp)).save();
        }

        this.updates.next(collegeId);
    }

    async updateCollegePower(collegeId: any, powerId: any, opts: any) {
        await this.cpModel.findOneAndUpdate({ college: collegeId, power: powerId }, {
            college: collegeId,
            power: powerId,
            ...opts
        }).exec();
    }

    async deleteCollegeEverywhere(collegeId: any) {
        await Promise.all([
            this.deleteByCollege(collegeId),
            this.consumptionService.deleteByCollege(collegeId),
            this.collegesService.deleteOne(collegeId)
        ]).catch(err => console.log(err));
    }

    deleteByCollege(collegeId: Types.ObjectId) {
        return this.cpModel.deleteMany({ college: collegeId }).exec();
    }

    async powerIsFree(powerId: Types.ObjectId) {
        const res = await this.cpModel.findOne({ power: powerId }).exec();
        return !res;
    }

    deleteByPower(powerId: Types.ObjectId) {
        return this.powersService.deleteOne(powerId);
    }
}
