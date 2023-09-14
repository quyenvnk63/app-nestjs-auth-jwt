/* eslint-disable @typescript-eslint/no-unused-vars */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { promises } from 'dns';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private primaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(authDTO: AuthDTO) {
    const hashedPassword = await argon.hash(authDTO.password);
    try {
      const user = await this.primaService.user.create({
        data: {
          email: authDTO.email,
          hashpassword: hashedPassword,
          firstname: '',
          lastname: '',
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      return {
        message: error,
      };
    }
  }

  async login(authDTO: AuthDTO) {
    try {
      const user = await this.primaService.user.findUnique({
        where: {
          email: authDTO.email,
        },
      });
      if (!user) {
        throw new ForbiddenException('User not found');
      }
      const mathpasswords = await argon.verify(
        user.hashpassword,
        authDTO.password,
      );
      if (!mathpasswords) {
        throw new ForbiddenException('password not incorrect');
      }
      delete user.hashpassword;
      return await this.convertObjecttoJwtString(user.id, user.email);
    } catch (error) {
      return { message: error };
    }
  }

  async convertObjecttoJwtString(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const jwtstring = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get('JWT'),
    });
    return {
      accessToken: jwtstring,
    };
  }
}
