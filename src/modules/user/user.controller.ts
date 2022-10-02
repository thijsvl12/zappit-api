import { Controller, Get, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  public async me(@Request() req) {
    return req.user;
  }
}
