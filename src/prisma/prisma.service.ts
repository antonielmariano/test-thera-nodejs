import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
    
    this.$use(async (params, next) => {
      const result = await next(params);
      
      const convertData = (obj) => {
        if (obj === null || obj === undefined) {
          return obj;
        }
        
        if (typeof obj === 'bigint') {
          return obj.toString();
        }
        
        if (obj instanceof Date) {
          return obj.toISOString();
        }
        
        if (Array.isArray(obj)) {
          return obj.map(convertData);
        }
        
        if (typeof obj === 'object') {
          const result = {};
          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              result[key] = convertData(obj[key]);
            }
          }
          return result;
        }
        
        return obj;
      };
      
      return convertData(result);
    });
  }

  async onModuleInit() {
    try {
      this.logger.log('Connecting to database...');
      await this.$connect();
      this.logger.log('Successfully connected to database');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
    this.logger.log('Successfully disconnected from database');
  }
}