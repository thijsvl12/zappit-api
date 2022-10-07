import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.APP_SECRET,
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}