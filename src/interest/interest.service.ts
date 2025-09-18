import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service.prisma';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class InterestService {
    constructor(private readonly prisma: PrismaService) { }

    async generateDailyInterests() {
        const wallets = await this.prisma.wallet.findMany({
            where: {
                type: 'WALLET', // Excluye CREDIT_CARD
                interestRate: { not: null },
            },
        });

        for (const wallet of wallets) {
            if (!wallet.interestRate) continue;

            const balance = new Decimal(wallet.balance ?? 0);

            if (balance.lte(0)) continue;

            // cálculo con Decimal
            const interestAmount = new Decimal(wallet.balance ?? 0)
                .mul(wallet.interestRate)
                .div(new Decimal(36500)); // divide entre 365 * 100

            if (interestAmount.lte(0)) continue;

            await this.prisma.$transaction(async (tx) => {
                // 1. Crear transacción de interés
                await tx.transaction.create({
                    data: {
                        walletId: wallet.id,
                        type: 'INTEREST',
                        name: 'Daily interest',
                        amount: interestAmount,
                        date: new Date(),
                    },
                });

                // 2. Actualizar balance y accruedInterest
                await tx.wallet.update({
                    where: { id: wallet.id },
                    data: {
                        balance: new Decimal(wallet.balance ?? 0).add(interestAmount),
                        accruedInterest: new Decimal(wallet.accruedInterest ?? 0).add(
                            interestAmount,
                        ),
                    },
                });
            });
        }
    }
}
