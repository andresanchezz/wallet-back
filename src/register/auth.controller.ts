// auth.controller.ts
import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) { }

    @Post('create')
    async create(@Body('name') name: string) {
        return this.auth.create(name);
    }

    @Post('login')
    async login(@Body('name') name: string) {
        const user = await this.auth.findByName(name);
        if (user) return user;
        return this.auth.create(name);
    }
}
