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

  public generateAccessToken(user: User): Promise<string> {
    // Expires in 30 minutes
    const expiresIn = 60 * 60 * 30;

    const signOptions: JwtSignOptions = {
      subject: user.username,
      expiresIn,
    };

    return this.jwtService.signAsync({}, signOptions);
  }

  public async generateRefreshToken(user: User): Promise<string> {
    // Expires in 60 days
    const expiresIn = 60 * 60 * 24 * 60;

    const token = await this.prisma.refreshToken.create({
      data: {
        expires: new Date(Date.now() + 1000 * expiresIn),
        user: { connect: { id: user.id } },
      },
    });

    const signOptions: JwtSignOptions = {
      subject: user.username,
      jwtid: token.id,
      expiresIn,
    };

    return this.jwtService.signAsync({}, signOptions);
  }
}
