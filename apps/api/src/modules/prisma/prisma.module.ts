import { Global, Module } from '@nestjs/common';
import { PrismaProvider } from './prisma.provider';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaProvider, PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
