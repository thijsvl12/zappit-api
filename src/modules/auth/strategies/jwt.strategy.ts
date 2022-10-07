import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt.interface';
import { PassportStrategy } from '@nestjs/passport';
import { PaswordlessUser } from '@modules/user/interfaces/user.interface';
import { UserService } from '@modules/user/user.service';
import { exclude } from './../../../utils/object.util';

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

  async validate(payload: JwtPayload): Promise<PaswordlessUser> {
    const user = await this.userService.findByUsername(payload.sub);

    if (!user) {
      throw new HttpException('invalid_token', HttpStatus.UNAUTHORIZED);
    }

    return exclude(user, 'password');
  }
}
