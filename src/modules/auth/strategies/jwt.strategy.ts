import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { JwtPayload } from '@interfaces/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findByUsername(payload.username);

    if (!user) {
      throw new HttpException('invalid_token', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
