import { Injectable } from '@nestjs/common';
import { CollegesService } from '../colleges/colleges.service';
import { College } from '../colleges/schemas/college.schema';
import { PowersService } from '../powers/powers.service';
import { Power } from '../powers/schemas/power.schema';
import { POWERS } from './powers-data';
import { COLLEGES } from './colleges-data';
import { getNumber, getNumbers } from './utils';
import { Consumption } from '../consumption/schemas/consumption.schema';
import { ConsumptionService } from '../consumption/consumption.service';
import { COLLEGES_POWERS } from './colleges-powers-data';
import { CollegesPowersService } from '../colleges-powers/colleges-powers.service';
import { CollegePower } from '../colleges-powers/schemas/college-power.schema';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class PopulateDBService {
    powers: Power[];
    colleges: College[];
    cp: CollegePower[];
    consumption: Consumption[];

    readonly CONSUMPTION_LEN = 400; // num of days

    constructor(
        private powersService: PowersService,
        private collegesService: CollegesService,
        private collegesPowersService: CollegesPowersService,
        private consumptionService: ConsumptionService,
        private usersService: UsersService
    ) {}

    async populate() {
        await this.populateUsers();
        await this.populatePowers();
        await this.populateColleges();
        await this.populateCollegePower();
        await this.populateConsumption();
    }

    private async populateUsers() {
        this.usersService.create('admin', 'admin');
    }

    private async populatePowers() {
        let promises = [];

        for (let p of POWERS) {
            promises.push(this.powersService.create(p));
        }

        await Promise.all(promises)
            .then(res => this.powers = res)
            .catch(err => console.log(`PopulateDBService.populatePowers failed: ${err}`));
    }

    private async populateColleges() {
        let promises = [];

        for (let c of COLLEGES) {
            promises.push(this.collegesService.create(c));
        }

        await Promise.all(promises)
            .then(res => this.colleges = res)
            .catch(err => console.log(`PopulateDBService.populateCollege failed: ${err}`));
    }

    private async populateCollegePower() {
        let promises = [];

        for (let cp of COLLEGES_POWERS) {
            let [ college, power ] = [ this.colleges[cp.college], this.powers[cp.power] ];
            let {minSpan, maxSpan, minAmt, maxAmt, warn, err} = cp;

            promises.push(this.collegesPowersService.create({
                college, power,
                minSpan, maxSpan,
                minAmt, maxAmt,
                warn, err,
                active: true,
            }));
        }

        await Promise.all(promises)
            .then(res => this.cp = res)
            .catch(err => console.log(`PopulateDBService.populateCollegePower failed: ${err}`));
    }

    private async populateConsumption() {
        let promises = [];

        for (let { college, power } of this.cp) {

            // set up `Date`
            let tmp = new Date().toISOString().split('T')[0];
            let time = new Date(`${tmp}T00:00`).getTime();

            // set up random numbers /for amounts/
            let rands = await getNumbers(this.CONSUMPTION_LEN, [50, 100], [-50, 50]);
            for (let amount of rands) {
                let date = new Date(time);

                promises.push(this.consumptionService.create({
                    date, college, power, amount
                }));

                // decrement by _one_ day
                time -= 86400000;
            }
        }

        await Promise.all(promises)
            .then(res => this.consumption = res)
            .catch(err => console.log(`PopulateDBService.populateConsumption failed: ${err}`));
    }
}
