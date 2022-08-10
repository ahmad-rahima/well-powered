import { Module } from '@nestjs/common';
import { ConsumptionService } from './consumption.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Consumption, ConsumptionSchema } from './schemas/consumption.schema';
import { CollegesModule } from '../colleges/colleges.module';
import { PowersModule } from '../powers/powers.module';


@Module({
    imports: [MongooseModule.forFeature([{ name: Consumption.name, schema: ConsumptionSchema }]),
             CollegesModule, PowersModule],
    providers: [ConsumptionService],
    exports: [ConsumptionService],
})
export class ConsumptionModule {
    constructor() {}
}
