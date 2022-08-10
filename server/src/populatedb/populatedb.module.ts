import { Module } from '@nestjs/common';
import { ConsumptionModule } from '../consumption/consumption.module';
import { CollegesModule } from '../colleges/colleges.module';
import { PowersModule } from '../powers/powers.module';
import { PopulateDBService } from './populatedb.service';
import { CollegesPowersModule } from '../colleges-powers/colleges-powers.module';
import { UsersModule } from 'src/users/users.module';


@Module({
    imports: [PowersModule, CollegesModule, ConsumptionModule, CollegesPowersModule, UsersModule],
    providers: [PopulateDBService],
    exports: [PopulateDBService],
})
export class PopulateDBModule {}
