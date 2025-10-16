import { Injectable } from '@nestjs/common';
import { FieldInput, FieldType, Session } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FieldService {
  constructor(private readonly prismaService: PrismaService) {}

  create(payload: FieldInput, user: Session) {
    return this.prismaService.field.create({
      data: {
        ...payload,
        type: payload.type as FieldType,
        metadata: payload.metadata,
        creator: { connect: { id: user.id } },
      },
    });
  }

  findAll() {
    return `This action returns all field`;
  }

  findOne(id: number) {
    return `This action returns a #${id} field`;
  }

  update(id: number, updateFieldDto: any) {
    return `This action updates a #${id} field`;
  }

  remove(id: number) {
    return `This action removes a #${id} field`;
  }
}
