import {
    IsUUID,
    IsOptional,
    IsEnum,
    IsNumber,
    IsDateString,
    IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
    INTEREST = 'INTEREST',
    TRANSFER = 'TRANSFER',
}

export class CreateTransactionDto {
    @IsUUID()
    walletId: string;

    @IsUUID()
    categoryId?: string;

    @IsString()
    name: string;

    @IsEnum(TransactionType)
    type: TransactionType;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    amount: number;

    @IsDateString()
    date: string;

    @IsUUID()
    @IsOptional()
    transferId?: string;
}
