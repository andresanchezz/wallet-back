import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/service.prisma';
import { WalletModule } from './wallet/wallet.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [WalletModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
