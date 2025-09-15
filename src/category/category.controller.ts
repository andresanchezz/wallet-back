import { CategoryService } from './category.service';
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {

    constructor(private readonly category: CategoryService) { }

    @Post()
    async create(@Body() dto: CreateCategoryDto) {
        return this.category.create(dto)
    }

    @Get()
    async fetchAll() {
        return this.category.fetch()
    }

    @Delete(":id")
    async delete(@Param('id') id: string) {
        return this.category.delete(id)
    }

}