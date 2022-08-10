import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CollegesService } from '../colleges/colleges.service';
import { CollegesPowersService } from './colleges-powers.service';
import { Types } from 'mongoose';
import { CollegeDto } from 'src/colleges/dto/college.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('api/colleges')
@UseGuards(JwtAuthGuard)
export class CollegesController {
    constructor(private cpService: CollegesPowersService) {}

    @Get()
    findPowers() {
        return this.cpService.findAllColleges();
    }

    @Get(':id')
    findCollege(@Param('id') id: Types.ObjectId) {
        return this.cpService.findOneAsCollegeDTO(id);
    }

    @Put(':id')
    updateCollege(@Param('id') id: Types.ObjectId, @Body() collegeDto: CollegeDto) {
        return this.cpService.updateCollegeDTO(id, collegeDto);
    }

    @Post()
    addCollege(@Body() collegeDto: CollegeDto) {
        return this.cpService.addCollegeDto(collegeDto);
    }

    @Delete(':id')
    deleteCollege(@Param('id') id: Types.ObjectId) {
        return this.cpService.deleteCollegeEverywhere(id);
    }
}
