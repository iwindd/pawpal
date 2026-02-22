import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Injectable } from '@nestjs/common';
import { RoleInput } from '@pawpal/shared';
import { PrismaService } from '../../../prisma/prisma.service';
import { IRoleRepository } from '../../domain/repository.port';

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getDatatable(query: DatatableQuery) {
    return this.prisma.role.getDatatable({
      query,
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        permissions: { select: { id: true, name: true } },
        _count: { select: { users: true } },
      },
      searchable: { name: { mode: 'insensitive' } },
    });
  }

  async findOne(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        permissions: { select: { id: true, name: true } },
        _count: { select: { users: true } },
      },
    });
  }

  async getPermissions() {
    return this.prisma.permission.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

  async create(payload: RoleInput) {
    return this.prisma.role.create({
      data: {
        name: payload.name,
        description: payload.description,
        permissions: {
          connect: payload.permissions.map((name) => ({ name })),
        },
      },
    });
  }

  async update(id: string, payload: RoleInput) {
    return this.prisma.role.update({
      where: { id },
      data: {
        name: payload.name,
        description: payload.description,
        permissions: {
          set: payload.permissions.map((name) => ({ name })),
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.role.delete({ where: { id } });
  }
}
