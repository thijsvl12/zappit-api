import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@modules/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  public generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = { username: user.username };

    return this.jwtService.signAsync(payload, {
      expiresIn: +process.env.JWT_ACCESS_EXPIRE,
    });
  }

  public async generateRefreshToken(user: User): Promise<string> {
    const token = await this.prisma.refreshToken.create({
      data: {
        expires: new Date(Date.now() + +process.env.JWT_REFRESH_EXPIRE),
        user: { connect: { id: user.id } },
      },
    });

    const payload: JwtPayload = {
      username: user.username,
      jwtid: token.id,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: +process.env.JWT_REFRESH_EXPIRE,
    });
  }
}

export interface JwtPayload {
  username: string;
  jwtid?: string;
}
