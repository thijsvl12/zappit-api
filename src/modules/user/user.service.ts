import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

import { CreateUserDto } from './dto/create-user.input';
import { LoginUserDto } from './dto/login-user.input';
import { PrismaService } from '@modules/prisma/prisma.service';
import { UpdatePasswordDto } from './dto/update-password.input';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updatePassword(payload: UpdatePasswordDto, id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await compare(payload.old_password, user.password);
    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    return await this.prisma.user.update({
      where: { id },
      data: { password: await hash(payload.new_password, 10) },
    });
  }

  async create(userData: CreateUserDto): Promise<User> {
    const userInDb = await this.prisma.user.findFirst({
      where: { username: userData.username },
    });

    if (userInDb) {
      throw new HttpException('user_already_exist', HttpStatus.CONFLICT);
    }

    return await this.prisma.user.create({
      data: {
        ...userData,
        password: await hash(userData.password, 10),
      },
    });
  }

  async findByLogin({ username, password }: LoginUserDto): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async findById(id: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        username,
      },
    });
  }
}
