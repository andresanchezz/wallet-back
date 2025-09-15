import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/service.prisma";
import { CreateWalletDto } from "./dto/create-wallet.dto";


@Injectable()
export class WalletService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateWalletDto) {
        return this.prisma.wallet.create({
            data: {
                userId: dto.userId,
                name: dto.name,
                type: dto.type,
                balance: dto.balance ?? undefined, // si no lo mandas → default(0)
                interestRate: dto.interestRate ?? undefined, // opcional
                // accruedInterest → siempre default(0), no se pasa aquí
            },
        });
    }

    async delete(walletId: string) {
        return this.prisma.wallet.delete({
            where: { id: walletId },
        });
    }

    async fetchByUserId(userId: string) {
        return this.prisma.wallet.findMany({
            where: { userId },
            include: { transactions: true },
        });
    }
}
