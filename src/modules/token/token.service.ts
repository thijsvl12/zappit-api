import { JWT_ACCESS_EXP, JWT_REFRESH_EXP } from '@constants/jwt.constant';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  public async findById(id: string) {
    return await this.prisma.refreshToken.findFirst({
      where: {
        id,
      },
    });
  }

  public async generateAccessToken(user: User): Promise<string> {
    const signOptions: JwtSignOptions = {
      subject: user.username,
      expiresIn: JWT_ACCESS_EXP,
    };

    return this.jwtService.signAsync({}, signOptions);
  }

  public async generateRefreshToken(user: User): Promise<string> {
    const token = await this.prisma.refreshToken.create({
      data: {
        expires: new Date(Date.now() + 1000 * JWT_REFRESH_EXP),
        user: { connect: { id: user.id } },
      },
    });

    const signOptions: JwtSignOptions = {
      subject: user.username,
      jwtid: token.id,
      expiresIn: JWT_REFRESH_EXP,
    };

    return this.jwtService.signAsync({}, signOptions);
  }
}
