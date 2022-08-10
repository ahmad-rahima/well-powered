import { Injectable, OnModuleInit } from '@nestjs/common';
import { CollegesPowersService } from 'src/colleges-powers/colleges-powers.service';
import { PowersService } from 'src/powers/powers.service';
import { Chart } from './chart';


@Injectable()
export class ChartInitService implements OnModuleInit {
    constructor(private powersService: PowersService, private cpService: CollegesPowersService) {}

    async onModuleInit() {
        const powers = await this.powersService.getEverything();

        for (let power of powers) {
            Chart.colors.set(power.name, power.color);
            Chart.units.set(power.name, power.unit);
        }

        this.powersService.updates
            .asObservable()
            .subscribe(async (id) => {
                const power = await this.powersService.findOne(id);
                Chart.colors.set(power.name, power.color);
                Chart.units.set(power.name, power.unit);
        });

        const cps = await this.cpService.getEverythingByNames();
        cps.forEach(cp => {
            const { college: collegeObj, power: powerObj, warn, err } = cp;
            const college = collegeObj.name.toString();
            const power = powerObj.name.toString();

            this.setErr(college, power, err);
            this.setWarn(college, power, warn);
        });

        this.cpService.updates
            .asObservable()
            .subscribe(async(collegeId) => {
                this.refreshSettings(collegeId);
            })
    }

    setErr(college: string, power: string, err: any) {
        const errCollegeBucket = Chart.errs.get(college) ||
            Chart.errs.set(college, new Map<string, number>()).get(college);
        errCollegeBucket.set(power, err);

    }

    setWarn(college: string, power: string, warn: any) {
        const warnCollegeBucket = Chart.warns.get(college) ||
            Chart.warns.set(college, new Map<string, number>()).get(college);
        warnCollegeBucket.set(power, warn);
    }

    async refreshSettings(collegeId: any) {
        const cps = await this.cpService.findByNamesByCollege(collegeId);
        cps.forEach(cp => {
            const { college: collegeObj, power: powerObj, warn, err } = cp;
            const college = collegeObj.name.toString();
            const power = powerObj.name.toString();

            this.setErr(college, power, err);
            this.setWarn(college, power, warn);
        });
    }

}
