import { BadRequestException, Controller, Get, HttpException, NotImplementedException, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DateRange } from 'src/interfaces/date-range';
import { ParseDatePipe } from '../parse-date.pipe';
import { ChartsService } from './charts.service';
import { OptionsService } from './options.service';

type ObjectId = Types.ObjectId;


@Controller('api/charts')
@UseGuards(JwtAuthGuard)
export class ChartsController {
    constructor(
        private chartsService: ChartsService,
        private optionsService: OptionsService
    ) {}

    @Get('test')
    test() { console.log('ChartsController works!'); }

    // @Get(['interval/college', 'monitor/college'])
    // async getIntervalCollegeOptions() {
    //     return this.optionsService.getCollegesOptions();
    // }

    // @Get(['interval/power', 'monitor/power'])
    // async getIntervalPowerOptions() {
    //     return this.optionsService.getPowersOptions();
    // }

    @Get('interval/:type/:id/days/:start/:end')
    async getIntervalCharts(
        @Param('type') type: string,
        @Param('id') id: ObjectId,
        @Param('start', ParseDatePipe) start: Date,
        @Param('end', ParseDatePipe) end: Date
    ) {
        switch (type) {
            case 'college':
                return this.chartsService.getIntervalCollege(id, { start, end });
            case 'power':
                return this.chartsService.getIntervalPower(id, { start, end });
            default:
                throw new BadRequestException('Bad URI chart type');
        }
    }

    @Get('interval/:collegeId/:powerId/days/:start/:end')
    async getIntervalChartsCard(
        @Param('collegeId') collegeId: ObjectId,
        @Param('powerId') powerId: ObjectId,
        @Param('start', ParseDatePipe) start: Date,
        @Param('end', ParseDatePipe) end: Date
    ) {
        return this.chartsService.getInterval(collegeId, powerId, { start, end });
    }

    @Get('total/:type/days/:start/:end')
    async getTotalCharts(
        @Param('type') type: string,
        @Param('start', ParseDatePipe) start: Date,
        @Param('end', ParseDatePipe) end: Date
    ) {
        switch (type) {
            case 'powers':
                return this.chartsService.getTotalPowers({ start, end });
            case 'colleges':
                return this.chartsService.getTotalColleges({ start, end });
            default:
                throw new BadRequestException('Bad URI chart type');
        }
    }

    @Get('monitor/:type/:id')
    async monitorCharts(
        @Param('type') type: string,
        @Param('id') id: ObjectId
    ) {
        switch (type) {
                case 'college':
                return this.chartsService.monitorByCollege(id);

                case 'power':
                return this.chartsService.monitorByPower(id);

                default:
                throw new NotImplementedException();
        }
    }
}
