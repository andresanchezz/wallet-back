import {
    IsUUID,
    IsEnum,
    IsNumber,
    IsOptional,
    IsDateString,
    IsString,
    Min,
    ValidateIf,
    MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
    @IsEnum(TransactionType)
    type: TransactionType;

    // Para transacciones normales (INCOME, EXPENSE, INTEREST): walletId es obligatorio
    @ValidateIf((o) => o.type !== TransactionType.TRANSFER)
    @IsUUID()
    walletId?: string;

    // Para TRANSFER: requerimos fromWalletId y toWalletId
    @ValidateIf((o) => o.type === TransactionType.TRANSFER)
    @IsUUID()
    fromWalletId?: string;

    @ValidateIf((o) => o.type === TransactionType.TRANSFER)
    @IsUUID()
    toWalletId?: string;

    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @IsString()
    @MaxLength(100)
    name: string;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    amount: number;

    @IsDateString()
    date: string;

    // transferId se generará internamente, no se espera del cliente
}
