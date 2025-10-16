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

  update(id: string, payload: FieldInput) {
    return this.prismaService.field.update({
      where: {
        id,
      },
      data: {
        ...payload,
        type: payload.type as FieldType,
        metadata: payload.metadata,
      },
    });
  }
}
