/* eslint-disable prettier/prettier */
import { AuthGuard } from '@nestjs/passport';
export class MyJwtGuard extends AuthGuard('jwt') {}
