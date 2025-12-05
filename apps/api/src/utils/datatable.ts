import { DatatableInput } from '@pawpal/shared';

const datatableUtils = {
  buildOrderBy: (sort: DatatableInput['sort'] | null) => {
    if (sort == null) return undefined;
    if (!sort?.columnAccessor || !sort?.direction) {
      return { createdAt: 'desc' }; // default
    }

    const fields = sort.columnAccessor.split('.');

    return fields.reverse().reduce((acc, field, i) => {
      if (i === 0) {
        return { [field]: sort.direction };
      }
      return { [field]: acc };
    }, {});
  },
};

export default datatableUtils;
