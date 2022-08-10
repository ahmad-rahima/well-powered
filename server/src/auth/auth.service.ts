import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LogsService } from 'src/logs/logs.service';
import { Log, PRT } from 'src/logs/schemas/log.schema';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private logsService: LogsService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);

        if (user) {
            const isMatch = await bcrypt.compare(pass, <string>user.password);
            if (isMatch) {
                const { username, _id: userId } = user;
                return { username, userId };
            }
        }
        return null;
    }

    async login(user: any) {
        const log: Log = {
            type: PRT.Info,
            content: `${user.username} just logged in.`,
            date: new Date(),
        };
        this.logsService.push(log);

        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
