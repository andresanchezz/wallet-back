import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/service.prisma";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateCategoryDto) {
        return this.prisma.category.create({
            data: {
                name: dto.name
            }
        })
    }

    async fetch() {
        return this.prisma.category.findMany();
    }

    async delete(id: string) {
        return this.prisma.category.delete({
            where: { id }
        })
    }

}