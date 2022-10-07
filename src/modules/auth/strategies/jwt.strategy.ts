import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt.interface';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('APP_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findByUsername(payload.sub);

    if (!user) {
      throw new HttpException('invalid_token', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
