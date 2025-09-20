import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";

@Controller("transaction")
export class TransactionController {
    constructor(private readonly service: TransactionService) { }

    @Post()
    async create(@Body() dto: CreateTransactionDto) {
        return this.service.create(dto);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateTransactionDto,
    ) {
        return this.service.update(id, dto);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return this.service.delete(id);
    }

    @Get()
    async findAll(
        @Query("userId") userId?: string,
        @Query("walletId") walletId?: string,
        @Query("page") page = "1",
        @Query("limit") limit = "10",
    ) {
        return this.service.findAll(userId, walletId, Number(page), Number(limit));
    }

}
