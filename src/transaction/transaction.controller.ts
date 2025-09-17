import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";


@Controller("transaction")
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Post()
    async create(@Body() dto: CreateTransactionDto) {
        return this.transactionService.create(dto);
    }

    @Get()
    async findByWallet(@Query("walletId") walletId: string) {
        return this.transactionService.findByWallet(walletId);
    }

    @Get("all")
    async findAllPaginated(
        @Query("page") page = "1",
        @Query("pageSize") pageSize = "10"
    ) {
        return this.transactionService.findAllPaginated(Number(page), Number(pageSize));
    }

    @Patch(":id")
    async update(@Param("id") id: string, @Body() dto: UpdateTransactionDto) {
        return this.transactionService.patch(id, dto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.transactionService.delete(id);
    }
}
