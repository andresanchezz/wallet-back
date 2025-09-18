import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { InterestService } from './interest.service';


@Injectable()
export class InterestCron {
    constructor(private readonly interestService: InterestService) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        await this.interestService.generateDailyInterests();
    }
}
