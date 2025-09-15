// prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './service.prisma';


@Global() // 👈 esto lo hace accesible en toda la app
@Module({
    providers: [PrismaService],
    exports: [PrismaService], // exportamos para que otros módulos puedan usarlo
})
export class PrismaModule { }
