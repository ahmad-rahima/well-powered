import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollegesService } from './colleges.service';
import { College, CollegeSchema } from './schemas/college.schema';


@Module({
    imports: [MongooseModule.forFeature([{ name: College.name, schema: CollegeSchema }])],
    providers: [CollegesService],
    exports: [CollegesService],
})
export class CollegesModule {

}
