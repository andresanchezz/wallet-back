import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/service.prisma";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { Prisma, TransactionType, TransactionDirection } from "@prisma/client";
import { randomUUID } from "crypto";

@Injectable()
export class TransactionService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateTransactionDto) {
        if (dto.type === TransactionType.TRANSFER) {
            // Transferencia → requiere fromWalletId y toWalletId
            const transferId = randomUUID();

            return this.prisma.$transaction(async (tx) => {
                // Crear movimiento de salida
                const fromTx = await tx.transaction.create({
                    data: {
                        walletId: dto.fromWalletId,
                        type: TransactionType.TRANSFER,
                        name: dto.name,
                        direction: TransactionDirection.OUT,
                        amount: dto.amount,
                        date: new Date(dto.date),
                        transferId,
                    },
                });

                // Crear movimiento de entrada
                const toTx = await tx.transaction.create({
                    data: {
                        walletId: dto.toWalletId,
                        type: TransactionType.TRANSFER,
                        name: dto.name,
                        direction: TransactionDirection.IN,
                        amount: dto.amount,
                        date: new Date(dto.date),
                        transferId,
                    },
                });

                // Actualizar balances
                await tx.wallet.update({
                    where: { id: dto.fromWalletId },
                    data: { balance: { decrement: dto.amount } },
                });

                await tx.wallet.update({
                    where: { id: dto.toWalletId },
                    data: { balance: { increment: dto.amount } },
                });

                return { from: fromTx, to: toTx };
            });
        }

        // INCOME, EXPENSE, INTEREST
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.create({
                data: {
                    walletId: dto.walletId,
                    categoryId: dto.categoryId ?? undefined,
                    type: dto.type,
                    name: dto.name,
                    amount: dto.amount,
                    date: new Date(dto.date),
                },
            });

            if (dto.type === TransactionType.INCOME) {
                await tx.wallet.update({
                    where: { id: dto.walletId },
                    data: { balance: { increment: dto.amount } },
                });
            }

            if (dto.type === TransactionType.EXPENSE) {
                await tx.wallet.update({
                    where: { id: dto.walletId },
                    data: { balance: { decrement: dto.amount } },
                });
            }

            // INTEREST → no tocar acá, lo hará el cron job
            return transaction;
        });
    }

    async update(id: string, dto: UpdateTransactionDto) {
        return this.prisma.transaction.update({
            where: { id },
            data: {
                date: dto.date ? new Date(dto.date) : undefined,
            },
        });
    }

    async delete(transactionId: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
        });

        if (!transaction) {
            throw new NotFoundException("Transaction not found");
        }

        // 🚨 Caso normal
        if (transaction.type !== "TRANSFER") {
            return this.prisma.$transaction(async (tx) => {
                if (transaction.type === "INCOME") {
                    await tx.wallet.update({
                        where: { id: transaction.walletId! },
                        data: { balance: { decrement: transaction.amount } },
                    });
                } else if (transaction.type === "EXPENSE") {
                    await tx.wallet.update({
                        where: { id: transaction.walletId! },
                        data: { balance: { increment: transaction.amount } },
                    });
                } else if (transaction.type === "INTEREST") {
                    await tx.wallet.update({
                        where: { id: transaction.walletId! },
                        data: { balance: { decrement: transaction.amount } },
                    });
                }

                return tx.transaction.delete({ where: { id: transaction.id } });
            });
        }

        // 🚨 Caso especial: TRANSFER
        if (!transaction.transferId) {
            throw new BadRequestException("Transfer transaction missing transferId");
        }

        const related = await this.prisma.transaction.findMany({
            where: { transferId: transaction.transferId },
        });

        if (related.length !== 2) {
            throw new BadRequestException("Corrupted transfer records");
        }

        const [t1, t2] = related;

        return this.prisma.$transaction(async (tx) => {
            // Revertir balances
            if (t1.direction === "OUT") {
                await tx.wallet.update({
                    where: { id: t1.walletId! },
                    data: { balance: { increment: t1.amount } },
                });
            }
            if (t2.direction === "IN") {
                await tx.wallet.update({
                    where: { id: t2.walletId! },
                    data: { balance: { decrement: t2.amount } },
                });
            }

            // Eliminar ambas transacciones
            await tx.transaction.deleteMany({
                where: { transferId: transaction.transferId },
            });

            return { deleted: related.map((t) => t.id) };
        });
    }


    async findAll(userId?: string, walletId?: string, page = 1, limit = 10) {
        const where: Prisma.TransactionWhereInput = {};

        if (walletId) {
            where.walletId = walletId;
        } else if (userId) {
            // Filtrar por todas las wallets de un usuario
            where.wallet = {
                userId: userId,
            };
        }

        const [items, total] = await this.prisma.$transaction([
            this.prisma.transaction.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { date: "desc" },
                include: {
                    wallet: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            icon: true,
                        },
                    },
                },
            }),
            this.prisma.transaction.count({ where }),
        ]);

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

}
