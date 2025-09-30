import { Injectable, NotFoundException } from '@nestjs/common';
import { Package } from '@pawpal/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PackageService {
  constructor(private readonly prisma: PrismaService) {}

  async getPackage(packageId: string): Promise<Package> {
    const pkg = await this.prisma.package.findFirst({
      where: {
        id: packageId,
      },
    });

    if (!pkg) throw new NotFoundException('invalid_package');
    return pkg;
  }
}
