/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
    constructor(private configService: ConfigService, private prismaService : PrismaService) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: configService.get('JWT'), // Make sure this matches your configuration key
        });
      
      }
      async validate(payload: {sub: number,email:string}){
        const user = await this.prismaService.user.findUnique({
            where: {email: payload.email}
        })
        delete user.hashpassword;
        return user;
       }
}
