import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { FieldService } from './field.service';

describe('FieldService', () => {
  let service: FieldService;
  let prisma: jest.Mocked<any>;

  const mockField = {
    id: 'field-1',
    label: 'Phone Number',
    placeholder: 'Enter phone number',
    type: 'TEXT',
    optional: false,
    metadata: {},
    order: 0,
    createdAt: new Date(),
  };

  const mockSession = {
    id: 'user-1',
    email: 'admin@test.com',
    displayName: 'Admin',
  } as any;

  beforeEach(async () => {
    prisma = {
      productField: {
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        getDatatable: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<FieldService>(FieldService);
  });

  describe('createProductField', () => {
    it('should create a product field', async () => {
      prisma.productField.create.mockResolvedValue(mockField);

      const result = await service.createProductField(
        'product-1',
        {
          label: 'Phone Number',
          placeholder: 'Enter phone number',
          type: 'TEXT',
          optional: false,
        },
        mockSession,
      );

      expect(prisma.productField.create).toHaveBeenCalled();
      expect(result).toEqual(mockField);
    });
  });

  describe('update', () => {
    it('should update a field', async () => {
      const updated = { ...mockField, label: 'Updated Label' };
      prisma.productField.update.mockResolvedValue(updated);

      const result = await service.update('field-1', {
        label: 'Updated Label',
        placeholder: 'Enter phone number',
        type: 'TEXT',
        optional: false,
      });

      expect(result.label).toBe('Updated Label');
    });
  });

  describe('getProductFieldDatatable', () => {
    it('should return paginated fields', async () => {
      const mockResult = { data: [mockField], total: 1 };
      prisma.productField.getDatatable.mockResolvedValue(mockResult);

      const result = await service.getProductFieldDatatable('product-1', {
        skip: 0,
        take: 10,
        orderBy: {},
      } as any);

      expect(prisma.productField.getDatatable).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('reorderProductField', () => {
    it('should reorder fields (move down)', async () => {
      prisma.$transaction.mockImplementation(async (fn) => fn());
      prisma.productField.updateMany.mockResolvedValue({ count: 1 });
      prisma.productField.update.mockResolvedValue(mockField);

      await service.reorderProductField('product-1', {
        fromIndex: 0,
        toIndex: 2,
        field_id: 'field-1',
      });

      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should reorder fields (move up)', async () => {
      prisma.$transaction.mockImplementation(async (fn) => fn());
      prisma.productField.updateMany.mockResolvedValue({ count: 1 });
      prisma.productField.update.mockResolvedValue(mockField);

      await service.reorderProductField('product-1', {
        fromIndex: 3,
        toIndex: 1,
        field_id: 'field-1',
      });

      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });
});
