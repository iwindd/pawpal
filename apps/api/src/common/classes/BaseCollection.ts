export abstract class BaseCollection<T> {
  constructor(protected readonly items: T[]) {}

  toJSON() {
    return this.items.map((item: any) =>
      typeof item.toJSON === 'function' ? item.toJSON() : item,
    );
  }

  toArray() {
    return this.items;
  }
}
