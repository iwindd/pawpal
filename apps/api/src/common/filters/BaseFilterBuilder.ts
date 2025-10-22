export class BaseFilterBuilder<TWhere extends Record<string, any>> {
  protected where: TWhere = {} as TWhere;

  protected merge(filter: Partial<TWhere>) {
    this.where = { ...this.where, ...filter };
    return this;
  }

  search(fields: string[], term?: string) {
    if (!term) return this;
    const OR = fields.map((field) => ({
      [field]: { contains: term, mode: 'insensitive' },
    }));
    this.merge({ OR } as unknown as Partial<TWhere>);
    return this;
  }

  status(field: keyof TWhere, statuses: string[]) {
    this.merge({ [field]: { in: statuses } } as Partial<TWhere>);
    return this;
  }

  dateRange(field: keyof TWhere, from?: Date, to?: Date) {
    const range: any = {};
    if (from) range.gte = from;
    if (to) range.lte = to;
    if (Object.keys(range).length)
      this.merge({ [field]: range } as Partial<TWhere>);
    return this;
  }

  build(): TWhere {
    return this.where;
  }
}
