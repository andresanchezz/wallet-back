import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { CreateWalletDto } from "./dto/create-wallet.dto";


@Controller("wallet")
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Post()
    async create(@Body() dto: CreateWalletDto) {
        return this.walletService.create(dto);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return this.walletService.delete(id);
    }

    @Get()
    async fetchByUserId(@Query("userId") userId: string) {
        return this.walletService.fetchByUserId(userId);
    }
}
