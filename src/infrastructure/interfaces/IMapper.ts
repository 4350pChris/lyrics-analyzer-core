import type { IAggregateRoot } from '../../domain/interfaces/IAggregateRoot.js';
import type { AnyItem } from 'dynamoose/dist/Item.js';

export interface IMapper<T extends IAggregateRoot, M = Partial<AnyItem>> {
  toDomain(item: M): T
  toModel(item: T): M
}
