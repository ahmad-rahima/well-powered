import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsumptionModule } from 'src/consumption/consumption.module';
import { RealtimeConsumptionModule } from 'src/realtime-consumption/realtime-consumption.module';
import { CollegesModule } from '../colleges/colleges.module';
import { PowersModule } from '../powers/powers.module';
import { CollegesPowersService } from './colleges-powers.service';
import { CollegesController } from './colleges.controller';
import { PowersController } from './powers.controller';
import { CollegePower, CollegePowerSchema } from './schemas/college-power.schema';


@Module({
    imports: [MongooseModule.forFeature([{ name: CollegePower.name, schema: CollegePowerSchema }]),
              CollegesModule, PowersModule, ConsumptionModule],
    controllers: [CollegesController, PowersController],
    providers: [CollegesPowersService],
    exports: [CollegesPowersService],
})
export class CollegesPowersModule {}
