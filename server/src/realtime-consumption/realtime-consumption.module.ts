import { Module } from '@nestjs/common';
import { LogsModule } from '../logs/logs.module';
import { CollegesPowersModule } from '../colleges-powers/colleges-powers.module';
import { CollegesModule } from '../colleges/colleges.module';
import { PowersModule } from '../powers/powers.module';
import { RealtimeConsumptionService } from './realtime-consumption.service';
import { RealtimeConsumptionGateway } from './realtime-consumption.gateway';


@Module({
    imports: [CollegesModule, PowersModule, CollegesPowersModule, LogsModule],
    providers: [RealtimeConsumptionService, RealtimeConsumptionGateway],
    exports: [RealtimeConsumptionService]
})
export class RealtimeConsumptionModule {

}
