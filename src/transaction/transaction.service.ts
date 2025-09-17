import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service.prisma';
import { CreateTransactionDto, TransactionType } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateTransactionDto) {
        return this.prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.findUnique({
                where: { id: dto.walletId },
            });

            if (!wallet) {
                throw new NotFoundException('Wallet not found');
            }

            const transaction = await tx.transaction.create({
                data: {
                    walletId: dto.walletId,
                    name: dto.name,
                    categoryId: dto.categoryId,
                    type: dto.type,
                    amount: dto.amount,
                    date: new Date(dto.date),
                    transferId: dto.transferId ?? undefined,
                },
            });

            let balanceChange = 0;

            switch (dto.type) {
                case TransactionType.INCOME:
                    balanceChange = dto.amount;
                    break;
                case TransactionType.EXPENSE:
                    balanceChange = -dto.amount;
                    break;
                case TransactionType.TRANSFER:
                    balanceChange = 0;
                    break;
                case TransactionType.INTEREST:
                    balanceChange = 0;
                    break;
            }

            if (balanceChange !== 0) {
                await tx.wallet.update({
                    where: { id: dto.walletId },
                    data: {
                        balance: { increment: balanceChange },
                    },
                });
            }

            return transaction;
        });
    }

    async findByWallet(walletId: string) {
        return this.prisma.transaction.findMany({
            where: { walletId },
            orderBy: { date: "desc" },
        });
    }

    async findAllPaginated(page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;
        const [items, total] = await this.prisma.$transaction([
            this.prisma.transaction.findMany({
                skip,
                take: pageSize,
                orderBy: { date: "desc" },
            }),
            this.prisma.transaction.count(),
        ]);

        return {
            items,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    async delete(transactionId: string) {
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.findUnique({
                where: { id: transactionId },
            });

            if (!transaction) {
                throw new NotFoundException('Transaction not found');
            }

            // Revertir balance (excepto INTEREST)
            let balanceChange = 0;

            switch (transaction.type) {
                case TransactionType.INCOME:
                    balanceChange = -transaction.amount.toNumber();
                    break;
                case TransactionType.EXPENSE:
                    balanceChange = transaction.amount.toNumber();
                    break;
                case TransactionType.TRANSFER:
                    balanceChange = 0;
                    break;
                case TransactionType.INTEREST:
                    balanceChange = 0;
                    break;
            }

            if (transaction.walletId && balanceChange !== 0) {
                await tx.wallet.update({
                    where: { id: transaction.walletId },
                    data: {
                        balance: { increment: balanceChange },
                    },
                });
            }

            return tx.transaction.delete({
                where: { id: transactionId },
            });
        });
    }

    async patch(transactionId: string, dto: { date: string }) {
        return this.prisma.transaction.update({
            where: { id: transactionId },
            data: {
                date: new Date(dto.date),
            },
        });
    }
}
