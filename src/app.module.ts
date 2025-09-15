import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [WalletModule, CategoryModule, TransactionModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
