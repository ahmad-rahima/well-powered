import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CollegesService } from '../colleges/colleges.service';
import { PowersService } from '../powers/powers.service';
import { CollegesPowersService } from '../colleges-powers/colleges-powers.service';
import { ConsumptionService } from '../consumption/consumption.service';
import { DateRange } from '../interfaces/date-range';
import { IntervalChart } from './interval-chart';
import { RealtimeChart } from './realtime-chart';
import { TotalPowersChart } from './total-powers-chart';
import { TotalCollegesChart } from './total-colleges-chart';


type ObjectId = Types.ObjectId;

@Injectable()
export class ChartsService {
    // readonly WS_MONITOR_URL = 'http://localhost:3000/ws';

    constructor(
        private collegesPowersService: CollegesPowersService,
        private consumptionService: ConsumptionService,
        private collegesService: CollegesService,
        private powersService: PowersService,
    ) {}

    async getInterval(collegeId: ObjectId, powerId: ObjectId, dateRng: DateRange) {
        let chartDetails = await this.consumptionService
            .findAll(collegeId, powerId, dateRng);
        if (chartDetails.length === 0) return null;

        let college = await this.collegesService.findOne(collegeId);
        let power   = await this.powersService.findOne(powerId);

        let { amount, date } = <{ amount: number[], date: Date[] }>
            this.detach(chartDetails);

        return new IntervalChart(
            'area', [`${college.name}: ${power.name}`, power.name], date, amount
        );
    }

    async getIntervalCollege(collegeId: ObjectId, dateRng: DateRange) {
        let chartDetails = await this.consumptionService.findAllByCollege(collegeId, dateRng);
        const college = await this.collegesService.findOne(collegeId);

        let charts = [];
        for (let power in chartDetails) {
            chartDetails[power] = this.detach(chartDetails[power]);

            let chart = new IntervalChart('area', [power, college.name],
                chartDetails[power].date,
                chartDetails[power].amount);
            charts.push(chart);
        }

        return charts;
    }

    async getIntervalPower(powerId: ObjectId, dateRng: DateRange) {
        let chartDetails = await this.consumptionService.findAllByPower(powerId, dateRng);
        const power = await this.powersService.findOne(powerId);

        let charts = [];
        for (let college in chartDetails) {
            chartDetails[college] = this.detach(chartDetails[college]);

            let chart = new IntervalChart('area', [college, power.name],
                chartDetails[college].date,
                chartDetails[college].amount);
            charts.push(chart);
        }

        return charts;
    }

    async monitorByCollege(collegeId: ObjectId) {
        let powers = await this.collegesPowersService.findPowersByCollege(collegeId);
        const college = await this.collegesService.findOne(collegeId);
        let charts = [];

        for (let power of powers) {
            let chart = new RealtimeChart('area', [power.name, college.name]);
            chart.powerId = power._id.toString();
            chart.collegeId = collegeId;
            charts.push(chart);
        }

        return charts;
    }

    async monitorByPower(powerId: ObjectId) {
        let colleges = await this.collegesPowersService.findCollegesByPower(powerId);
        const power = await this.powersService.findOne(powerId);
        let charts = [];

        for (let college of colleges) {
            let chart = new RealtimeChart('area', [college.name, power.name]);
            chart.collegeId = college._id.toString();
            chart.powerId = powerId;
            charts.push(chart);
        }

        return charts;
    }

    async getTotalPowers(dateRng: DateRange) {
        let chartDetails = await this.consumptionService
            .findTotalPowers(dateRng);

        let charts = [];
        for (let college in chartDetails) {
            let chart = [];
            let collegeData = chartDetails[college];
            for (let power in collegeData) {
                let { amount } = collegeData[power];
                chart.push({ power, amount });
            }

            chartDetails[college] = this.detach(chart);
            charts.push(new TotalPowersChart(
                'bar', college,
                chartDetails[college].power,
                chartDetails[college].amount
            ));
        }

        return charts;
    }

    async getTotalColleges(dateRng: DateRange) {
        let chartDetails = await this.consumptionService
            .findTotalColleges(dateRng);

        let charts = [];
        for (let power in chartDetails) {
            let chart = [];
            let powerData = chartDetails[power];
            for (let college in powerData) {
                let { amount } = powerData[college];
                chart.push({ college, amount });
            }

            chartDetails[power] = this.detach(chart);
            charts.push(new TotalCollegesChart(
                'bar', power,
                chartDetails[power].college,
                chartDetails[power].amount
            ));
        }

        return charts;
    }

    /* detach -- convert from 'array of objects' to 'object of arrays'
     * Input: [{ p0: v0, p1: v1 }, ...]
     * Output: { p0: [v0, ...], p1: [v1, ...] }
     */
    private detach(chart: any[]) {
        if (chart.length === 0) return {};

        let res = {};

        for (let key of Object.keys(chart[0])) res[key] = [];

        for (let elt of chart) {
            for (let key of Object.keys(elt)) res[key].push(elt[key]);
        }

        return res;
    }

}
