import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CollegesPowersService } from './colleges-powers.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Types } from 'mongoose';


@Controller('api/powers')
@UseGuards(JwtAuthGuard)
export class PowersController {
    constructor(private cpService: CollegesPowersService) {}

    @Delete(':id')
    async deletePower(@Param('id') id: Types.ObjectId) {
        const free = await this.cpService.powerIsFree(id);
        if (!free)
            return { msg: "Power is not free to delete!" };

        return this.cpService.deleteByPower(id);
    }
}
