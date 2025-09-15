import { IsUUID, IsEnum, IsOptional, IsNumber, IsPositive, IsString, MaxLength, Min } from "class-validator";
import { Type } from "class-transformer";

export enum WalletType {
    WALLET = "WALLET",
    CREDIT_CARD = "CREDIT_CARD",
}

export class CreateWalletDto {
    @IsUUID()
    userId: string;

    @IsString()
    @MaxLength(100)
    name: string; // en front lo llamas "bank"

    @IsEnum(WalletType)
    type: WalletType;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    balance?: number; // si no lo pasas → default(0)

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    interestRate?: number; // anual, ej: 5.00
}

export class UpdateWalletDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsEnum(WalletType)
    type?: WalletType;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    interestRate?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    balance?: number;

    // 👇 accruedInterest no debería venir de fuera en ningún caso al crear
    // pero en update sí se puede tocar (ej: proceso de intereses acumulados)
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    accruedInterest?: number;
}
