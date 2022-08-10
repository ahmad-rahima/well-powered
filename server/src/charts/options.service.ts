import { Injectable } from '@nestjs/common';
import { CollegesService } from '../colleges/colleges.service';
import { PowersService } from '../powers/powers.service';


@Injectable()
export class OptionsService {
    constructor(
        private collegesService: CollegesService,
        private powersService: PowersService
    ) {}

    async getCollegesOptions() {
        let colleges = await this.collegesService.findAllColleges();
        return colleges;
        //     .map(c => {
        //     return { name: c.name, id: c._id};
        // });
    }

    async getPowersOptions() {
        let powers = await this.powersService.findAllPowers();
        return powers;
        //     .map(p => {
        //     return { name: p.name, id: p._id};
        // });
    }
}
