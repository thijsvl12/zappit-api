import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@modules/auth/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { TokenService } from '@modules/token/token.service';
import { UserService } from '@modules/user/user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [AuthService, UserService, TokenService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}