import { Body, Controller, Get, OnModuleInit, Post, Request, UseGuards } from '@nestjs/common';
import * as webpush from 'web-push';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';


@Controller('api')
export class AppController implements OnModuleInit {
  constructor(
    private authService: AuthService
  ) {}

  onModuleInit() {
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfileTest(@Request() req) {
    return req.user;
  }
}
