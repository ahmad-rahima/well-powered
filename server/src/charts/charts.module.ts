import { Module } from '@nestjs/common';
import { CollegesModule } from '../colleges/colleges.module';
import { PowersModule } from '../powers/powers.module';
import { ConsumptionModule } from '../consumption/consumption.module';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';
import { OptionsService } from './options.service';
import { CollegesPowersModule } from '../colleges-powers/colleges-powers.module';
import { ChartInitService } from './chart-init.service';


@Module({
    imports: [ConsumptionModule, CollegesModule, PowersModule, CollegesPowersModule],
    controllers: [ChartsController],
    providers: [ChartsService, OptionsService, ChartInitService],
})
export class ChartsModule {}
