import { IsDateString } from "class-validator";

export class UpdateTransactionDto {
    @IsDateString()
    date: string;  // formato ISO8601 (ej: "2025-09-12T12:30:00Z")
}
