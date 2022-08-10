import { Body, Catch, Controller, Delete, Get, Headers, Param, Post, Put, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PowersService } from './powers.service';
import { Power } from './schemas/power.schema';


@Controller('api/powers')
@UseGuards(JwtAuthGuard)
export class PowersController {

    constructor(private powersService: PowersService) {}

    @Get()
    findPowers() {
        return this.powersService.findAllPowers();
    }

    @Get(':id')
    findPower(@Param('id') id: Types.ObjectId) {
        return this.powersService.findOne(id);
    }

    @Put(':id')
    updatePower(@Param('id') id: Types.ObjectId, @Body() power: any) {
        this.powersService.updateOne(id, power);
    }

    @Post()
    async addPower(@Body() power: any) {
        await this.powersService.createIfUnique(power);
    }
}
