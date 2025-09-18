import { Module } from '@nestjs/common';
import { InterestService } from './interest.service';

import { PrismaService } from 'src/prisma/service.prisma';
import { InterestCron } from './interest.cron';

@Module({
    providers: [InterestService, InterestCron, PrismaService],
})
export class InterestModule { }
