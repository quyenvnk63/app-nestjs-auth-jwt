import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
//this service is used to connect to DB
export class PrismaService extends PrismaClient {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          // url: 'mysql://root:Abc123456789@localhost:3307/testdb?schema=public',
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }
}
