import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/service.prisma";

@Injectable()
export class AuthService {

    constructor(private readonly prisma: PrismaService) { }

    async create(name: string) {
        return this.prisma.user.create({
            data: {
                name
            }
        })
    }

    // auth.service.ts
    async findByName(name: string) {
        return this.prisma.user.findUnique({
            where: { name },
        });
    }


}