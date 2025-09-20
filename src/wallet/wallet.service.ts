import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/service.prisma";
import { CreateWalletDto } from "./dto/create-wallet.dto";
import { Decimal } from "@prisma/client/runtime/library";


@Injectable()
export class WalletService {
    constructor(private readonly prisma: PrismaService) { }



    async create(dto: CreateWalletDto) {
        return this.prisma.wallet.create({
            data: {
                userId: dto.userId,
                name: dto.name,
                type: dto.type,
                balance: new Decimal(dto.balance ?? 0),
                interestRate: new Decimal(dto.interestRate ?? 0),
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
