import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LogsModule } from 'src/logs/logs.module';


@Module({
  imports: [
    UsersModule,
    PassportModule,
    LogsModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      // signOptions: { expiresIn: '60s' },
    })
  ],
  providers: [AuthService, LocalStrategy, LocalAuthGuard, JwtStrategy, JwtAuthGuard],
  exports: [AuthService]
})
export class AuthModule {}
