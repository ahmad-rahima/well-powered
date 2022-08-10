import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PowersController } from './powers.controller';
import { PowersService } from './powers.service';
import { Power, PowerSchema } from './schemas/power.schema';


@Module({
    imports: [MongooseModule.forFeature([{ name: Power.name, schema: PowerSchema }])],
    controllers: [PowersController],
    providers: [PowersService],
    exports: [PowersService],
})
export class PowersModule {

}
