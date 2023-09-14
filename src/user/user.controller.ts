import { Controller, Get, UseGuards } from '@nestjs/common';
import { MyJwtGuard } from '../auth/gaurd';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/user.decorator';

@Controller('user')
export class UserController {
  @UseGuards(new MyJwtGuard())
  @Get('me')
  me(@GetUser() user: User) {
    return user;
  }
}
