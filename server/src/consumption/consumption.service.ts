import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
import { CollegesService } from '../colleges/colleges.service';
import { DateRange } from '../interfaces/date-range';
import { Consumption, ConsumptionDocument } from './schemas/consumption.schema';
import { PowersService } from '../powers/powers.service';

type ObjectId = Types.ObjectId;

@Injectable()
export class ConsumptionService {
    constructor(
        @InjectModel(Consumption.name) private consumptionModel: Model<ConsumptionDocument>,
        private collegeService: CollegesService,
        private powersService: PowersService
    ) { }

    async create(consumption: Consumption): Promise<Consumption> {
        let createCon = new this.consumptionModel(consumption);
        return createCon.save();
    }

    async findAll(collegeId: ObjectId, powerId: ObjectId, dr: DateRange): Promise<Object[]> {
        try {
            let res = await this.consumptionModel
                .find({
                    college: collegeId, power: powerId,
                    date: { $gte: dr.start, $lte: dr.end }
                })
                .select('amount date')
                .exec();
            // FIXME: handle error condition!

            let ret = [];
            for (let { amount, date } of res)
                ret.push({ amount, date });

            return ret;
        } catch (err) {
            console.log(`ConsumptionService.findAll failed: ${err}`);
            return [{}];
        }
    }

    async findAllByCollege(id: ObjectId, dr: DateRange): Promise<Object> {

        let elts = await this.consumptionModel.find({
            college: id,
            date: { $gte: dr.start, $lte: dr.end }
        }).select('power amount date')
            .populate('power')
            .exec();
        // FIXME: handle error condition!

        let ret = Object();
        for (let { power, amount, date } of elts) {
            if (!(power.name in ret)) ret[power.name] = [];

            ret[power.name].push({ amount, date });
        }

        return ret;
    }

    async findAllByPower(id: ObjectId, dr: DateRange): Promise<Object> {

        let elts = await this.consumptionModel.find({
            power: id,
            date: { $gte: dr.start, $lte: dr.end }
        }).select('college amount date')
            .populate('college')
            .exec();
        // FIXME: handle error condition!

        let ret = Object();
        for (let { college, amount, date } of elts) {
            if (!(college.name in ret)) ret[college.name] = [];

            ret[college.name].push({ amount, date });
        }

        return ret;
    }


    // this is only for one college card
    async findTotalPowersByCollege(collegeId: ObjectId, dateRng: DateRange):
        Promise<Object> {
        let ret = Object();
        let chartDetails = await this.findAllByCollege(collegeId, dateRng);

        // reduce power amount values
        for (let power in chartDetails) {
            // get the total amount by reducing power amount values
            let amount = 0;
            chartDetails[power].forEach(elt => amount += elt.amount);

            // get the first date
            let date = chartDetails[power][0].date;

            ret[power] = { amount, date };
        }

        return ret;
    }

    async findTotalCollegesByPower(powerId: ObjectId, dateRng: DateRange):
        Promise<Object> {
        let ret = Object();
        let chartDetails = await this.findAllByPower(powerId, dateRng);

        // reduce college amount values
        for (let college in chartDetails) {
            // get the total amount by reducing college amount values
            let amount = 0;
            chartDetails[college].forEach(elt => amount += elt.amount);

            // get the first date
            let date = chartDetails[college][0].date;

            ret[college] = { amount, date };
        }

        return ret;
    }

    async findTotalPowers(dateRng: DateRange): Promise<Object> {
        let ret = Object();
        let colleges = await this.collegeService.findAllColleges();

        for (let { _id, name } of colleges) {
            ret[name] = await this.findTotalPowersByCollege(_id, dateRng);
        }

        return ret;
    }

    async findTotalColleges(dateRng: DateRange): Promise<Object> {
        let ret = Object();
        let powers = await this.powersService.findAllPowers();

        for (let { _id, name } of powers) {
            ret[name] = await this.findTotalCollegesByPower(_id, dateRng);
        }

        return ret;
    }

    deleteByCollege(collegeId) {
        return this.consumptionModel.deleteMany({ college: collegeId }).exec();
    }

    deleteByPower(powerId) {
        return this.consumptionModel.find({ powerId }, (err, docs) => {
            docs.forEach(c => c.remove());
        }).exec();
    }
}
